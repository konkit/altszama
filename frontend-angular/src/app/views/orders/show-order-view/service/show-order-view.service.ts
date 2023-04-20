import {Injectable} from '@angular/core';
import {BehaviorSubject, EMPTY, filter, map, Observable, switchMap, take, tap} from "rxjs";
import {
  OrderControllerService,
  ParticipantsOrderEntry,
  ShowOrderDto,
  ShowOrderResponse
} from "../../../../../frontend-client";
import {AuthService} from "../../../../service/auth.service";
import {EventSourcePolyfill} from "event-source-polyfill";
import {PaymentOptionsData, PriceSummaryData, ShowOrderViewState} from "../lib/model";
import {
  BankTransferQrcodeModal,
  QrcodeModalInput
} from "../components/payment-options-summary/bank-transfer-qrcode-modal/bank-transfer-qrcode-modal.component";
import {MatDialog} from "@angular/material/dialog";
import OrderStateEnum = ShowOrderDto.OrderStateEnum;

//TODO: Clear state on entry


@Injectable({
  providedIn: 'root'
})
export class ShowOrderViewService {

  orderResponse = new BehaviorSubject<ShowOrderResponse | null>(null)

  otherUserOrderEntries = new BehaviorSubject<Array<ParticipantsOrderEntry>>([])

  showOrderViewState$: Observable<ShowOrderViewState> = this.createShowOrderViewStateObservable()

  constructor(private orderControllerService: OrderControllerService,
              private matDialog: MatDialog,
              private authService: AuthService) {
  }

  loadOrderResponseToAllSubjects(id: string | null): Observable<ShowOrderResponse> {
    if (id != null) {
      return this.orderControllerService.show(id)
        .pipe(
          tap(response => this.orderResponse.next(response)),
          tap(response => {
            let otherEntries = response.orderEntries.filter(e => e.userId != response.currentUserId)
            this.otherUserOrderEntries.next(otherEntries)
          })
        )
    } else {
      return EMPTY;
    }
  }

  private getOrderIdObservableFromOrderResponse(): Observable<string> {
    return this.orderResponse.pipe(
      take(1),
      map(r => r!.order.id),
      filter(isNonNullGuard),
    )
  }

  reloadWholeOrderResponse(): Observable<void> {
    return this.getOrderIdObservableFromOrderResponse().pipe(
      switchMap(orderId => this.loadOrderResponseToAllSubjects(orderId)),
      map(() => void 0)
    )
  }

  reloadJustOtherUserOrderEntries(): Observable<void> {
    return this.getOrderIdObservableFromOrderResponse().pipe(
      switchMap(orderId => this.orderControllerService.show(orderId)),
      tap(response => {
        let otherEntries = response.orderEntries.filter(e => e.userId != response.currentUserId)
        this.otherUserOrderEntries.next(otherEntries)
      }),
      map(() => void 0)
    )
  }

  orderResponseAsObservable(): Observable<ShowOrderResponse> {
    return this.orderResponse.asObservable()
      .pipe(filter(isNonNullGuard))
  }

  otherUserOrderEntriesAsObservable() {
    return this.otherUserOrderEntries.asObservable()
  }

  getShowOrderViewState(): Observable<ShowOrderViewState> {
    return this.showOrderViewState$;
  }

  private createShowOrderViewStateObservable() {
    return this.orderResponse.pipe(
      filter(isNonNullGuard),
      map(r => {
        let order = r.order
        let orderState = r.order.orderState
        let orderEntries = r.orderEntries
        let currentUserId = r.currentUserId

        let isOrderOwner = order.orderCreatorId === currentUserId;
        let canShowPlaceOrderButton = isOrderOwner && [OrderStateEnum.CREATED, OrderStateEnum.ORDERING].includes(order.orderState)
        let canShowMarkAsDeliveredButton = isOrderOwner && orderState === OrderStateEnum.ORDERED;
        let isPlaceOrderButtonDisabled = orderEntries.length === 0;

        let username = this.authService.getLoggedUser()!.username;
        let yourOrderEntries = orderEntries.filter(e => e.userId === currentUserId);

        let allEatingPeopleCount = orderEntries.flatMap(e => e.dishEntries).length;
        let numberOfCurrentUserEntries = yourOrderEntries.length;
        let shouldDisplayNewOrderEntryCard = order.orderState == OrderStateEnum.CREATED && numberOfCurrentUserEntries === 0

        let isAnyOrderEntryOwner = numberOfCurrentUserEntries > 0
        let isOrderedOrDelivered = [OrderStateEnum.ORDERED, OrderStateEnum.DELIVERED].includes(order.orderState);
        let shouldShowQRCodeButton = isAnyOrderEntryOwner && isOrderedOrDelivered && order.paymentData.paymentByBankTransfer;

        let priceSummaryData: PriceSummaryData = {
          deliveryData: r.order.deliveryData,
          basePriceSum: r.baseOrderPrice,
          totalPrice: r.totalOrderPrice,
          allEatingPeopleCount: r.orderEntries.flatMap(e => e.dishEntries).length,
        }

        let paymentOptionsData: PaymentOptionsData = {
          shouldShowQRCodeButton: shouldShowQRCodeButton
        }

        let shouldShowOrderLockedWarning = isOrderOwner && [OrderStateEnum.ORDERING].includes(order.orderState);

        let obj: ShowOrderViewState = {
          canShowPlaceOrderButton: canShowPlaceOrderButton,
          isPlaceOrderButtonDisabled: isPlaceOrderButtonDisabled,
          canShowMarkAsDeliveredButton: canShowMarkAsDeliveredButton,
          shouldDisplayNewOrderEntryCard: shouldDisplayNewOrderEntryCard,
          isOrderOwner: isOrderOwner,
          allEatingPeopleCount: allEatingPeopleCount,
          numberOfCurrentUserEntries: numberOfCurrentUserEntries,
          username: username,
          yourOrderEntries: yourOrderEntries,
          priceSummaryData: priceSummaryData,
          paymentOptionsData: paymentOptionsData,
          shouldShowOrderLockedWarning: shouldShowOrderLockedWarning,
        }
        return obj
      })
    );
  }

  handleOrderChangeSSE() {
    this.orderResponse.pipe(
      take(1),
      map(r => r!.order.id)
    ).subscribe(orderId => {
      let token = this.authService.getLoggedUser()?.token
      let es = new EventSourcePolyfill('/api/orders/sse', {headers: {Authorization: "Bearer " + token}});

      const eventListener = (event: any) => {
        const data = JSON.parse(event.data)
        if (data.orderId === orderId) {
          console.log("Reloading order response")
          this.reloadJustOtherUserOrderEntries().subscribe()
        }
      };

      es.addEventListener("message", eventListener);
    })
  }

  showQrModal() {
    this.orderResponse.asObservable().pipe(take(1), filter(isNonNullGuard)).subscribe(showOrderResponse => {
      let orderEntries = showOrderResponse.orderEntries
      let currentUserId = showOrderResponse.currentUserId
      let yourOrderEntries = orderEntries.filter(e => e.userId === currentUserId);


      let data: QrcodeModalInput = {
        paymentData: showOrderResponse.order.paymentData,
        yourOrderEntries: yourOrderEntries,
        orderCreatorUsername: showOrderResponse.order.orderCreatorUsername,
        orderDate: showOrderResponse.order.orderDate
      }
      this.matDialog.open(BankTransferQrcodeModal, { width: '300px', data: data })
    })
  }
}

function isNonNullGuard<T>(value: T): value is NonNullable<T> {
  return value != null;
}
