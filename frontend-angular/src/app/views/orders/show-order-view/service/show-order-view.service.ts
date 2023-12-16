import {Injectable} from '@angular/core';
import {BehaviorSubject, EMPTY, filter, map, Observable, of, switchMap, take, tap} from "rxjs";
import {
  OrderControllerService,
  ParticipantsOrderEntry,
  ShowOrderDto,
  ShowOrderResponse
} from "../../../../../frontend-client";
import {AuthService} from "../../../../service/auth.service";
import {EventSourcePolyfill} from "event-source-polyfill";
import {PaymentOptionsData, PriceSummaryData, ShowOrderViewState, ShowOrderViewStateFlags} from "../lib/model";
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

  private orderResponse = new BehaviorSubject<ShowOrderResponse | null>(null)

  otherUserOrderEntries = new BehaviorSubject<Array<ParticipantsOrderEntry>>([])

  showOrderViewState$: Observable<ShowOrderViewState> = this.createShowOrderViewStateObservable()

  constructor(private orderControllerService: OrderControllerService,
              private matDialog: MatDialog,
              private authService: AuthService) {
  }

  loadOrderResponseToAllSubjects(id: string | null): Observable<ShowOrderResponse> {
    console.log("loadOrderResponseToAllSubjects", new Date())
    if (id != null) {
      return this.orderControllerService.show(id)
        .pipe(
          switchMap(response => {
            let otherEntries = response.orderEntries
              .filter(e => e.userId != response.currentUserId)
            console.log("this.otherUserOrderEntries.next(otherEntries)", new Date())
            this.otherUserOrderEntries.next(otherEntries)
            console.log("this.orderResponse.next(response)", new Date())
            this.orderResponse.next(response)
            return of(response)
          }),
        )
    } else {
      return EMPTY;
    }
  }

  private getOrderId$(): Observable<string> {
    return this.showOrderViewState$.pipe(
      take(1),
      map(s => s!.order.id),
      filter(isNonNullGuard),
    )
  }

  reloadWholeOrderResponse(): Observable<void> {
    console.log("reloadWholeOrderResponse", new Date())
    return this.getOrderId$().pipe(
      switchMap(orderId => this.loadOrderResponseToAllSubjects(orderId)),
      map(() => void 0)
    )
  }

  reloadJustOtherUserOrderEntries(): Observable<void> {
    return this.getOrderId$().pipe(
      switchMap(orderId => this.orderControllerService.show(orderId)),
      tap(response => {
        let otherEntries = response.orderEntries.filter(e => e.userId != response.currentUserId)
        this.otherUserOrderEntries.next(otherEntries)
      }),
      map(() => void 0)
    )
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
        let flags = this.getViewStateFlags(r);

        let username = this.authService.getLoggedUser()!.username;
        let yourOrderEntries = r.orderEntries.filter(e => e.userId === r.currentUserId);

        let allEatingPeopleCount = r.orderEntries.flatMap(e => e.dishEntries).length;
        let allDishesInRestaurant = r.allDishesInRestaurant

        let isAnyOrderEntryOwner = yourOrderEntries.length > 0
        let isOrderedOrDelivered = [OrderStateEnum.ORDERED, OrderStateEnum.DELIVERED].includes(r.order.orderState);
        let shouldShowQRCodeButton = isAnyOrderEntryOwner && isOrderedOrDelivered && r.order.paymentData.paymentByBankTransfer;

        let priceSummaryData: PriceSummaryData = {
          deliveryData: r.order.deliveryData,
          basePriceSum: r.baseOrderPrice,
          totalPrice: r.totalOrderPrice,
          allEatingPeopleCount: r.orderEntries.flatMap(e => e.dishEntries).length,
        }

        let paymentOptionsData: PaymentOptionsData = {
          shouldShowQRCodeButton: shouldShowQRCodeButton
        }

        let obj: ShowOrderViewState = {
          order: r.order,
          flags: flags,
          allDishesInRestaurant: allDishesInRestaurant,
          allEatingPeopleCount: allEatingPeopleCount,
          currentUserId: r.currentUserId,
          username: username,
          yourOrderEntries: yourOrderEntries,
          priceSummaryData: priceSummaryData,
          paymentOptionsData: paymentOptionsData,
        }
        return obj
      })
    );
  }

  private getViewStateFlags(r: ShowOrderResponse): ShowOrderViewStateFlags {
    let isOrderOwner = r.order.orderCreatorId === r.currentUserId;
    let canShowPlaceOrderButton = isOrderOwner && [OrderStateEnum.CREATED, OrderStateEnum.ORDERING].includes(r.order.orderState)
    let canShowMarkAsDeliveredButton = isOrderOwner && r.order.orderState === OrderStateEnum.ORDERED;
    let isPlaceOrderButtonDisabled = r.orderEntries.length === 0;
    let shouldShowOrderLockedWarning = isOrderOwner && [OrderStateEnum.ORDERING].includes(r.order.orderState);

    return {
      canShowPlaceOrderButton: canShowPlaceOrderButton,
      isPlaceOrderButtonDisabled: isPlaceOrderButtonDisabled,
      canShowMarkAsDeliveredButton: canShowMarkAsDeliveredButton,
      shouldShowOrderLockedWarning: shouldShowOrderLockedWarning,
      isOrderOwner: isOrderOwner,
    };
  }

  handleOrderChangeSSE() {
    this.getOrderId$().subscribe(orderId => {
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
    this.showOrderViewState$
      .pipe(
        take(1),
        filter(isNonNullGuard)
      )
      .subscribe(viewState => {
        let data: QrcodeModalInput = {
          paymentData: viewState.order.paymentData,
          yourOrderEntries: viewState.yourOrderEntries,
          orderCreatorUsername: viewState.order.orderCreatorUsername,
          orderDate: viewState.order.orderDate
        }
        this.matDialog.open(BankTransferQrcodeModal, {width: '330px', data: data})
      })
  }
}

function isNonNullGuard<T>(value: T): value is NonNullable<T> {
  return value != null;
}
