import {Injectable} from '@angular/core';
import {BehaviorSubject, catchError, EMPTY, filter, map, Observable, of, switchMap, take, tap} from "rxjs";
import {
  OrderControllerService,
  OrderEntryControllerService,
  OrderEntrySaveRequest,
  OrderEntryUpdateRequest,
  ParticipantsOrderEntry,
  ShowOrderDto,
  ShowOrderResponse
} from "../../../../../frontend-client";
import {PriceSummaryInput} from "../components/price-summary/price-summary.component";
import {AuthService} from "../../../../service/auth.service";
import {ErrorSnackBarService} from "../../../../service/error-snack-bar.service";
import OrderStateEnum = ShowOrderDto.OrderStateEnum;
import {EventSourcePolyfill} from "event-source-polyfill";

//TODO: Clear state on entry

export interface ShowOrderViewState {
  canShowPlaceOrderButton: boolean
  isPlaceOrderButtonDisabled: boolean
  canShowMarkAsDeliveredButton: boolean
  shouldDisplayNewOrderEntryCard: boolean
  shouldShowQRCodeButton: boolean,
  isOrderOwner: boolean,
  allEatingPeopleCount: number,
  numberOfCurrentUserEntries: number,
  username: string,
  yourOrderEntries: ParticipantsOrderEntry[],
  priceSummaryInput: PriceSummaryInput;
  shouldShowOrderLockedWarning: boolean;
}

export interface ModifyOrderEntryState {
  loadingEntry: boolean;

  orderEntryId: string;
  dishEntryId: string;

  isEntryCreating: boolean;
  isEntryEdited: boolean;
}

const initialModifyOrderEntryState: ModifyOrderEntryState = {
  loadingEntry: false,

  orderEntryId: "",
  dishEntryId: "",

  isEntryCreating: false,
  isEntryEdited: false,
};


@Injectable({
  providedIn: 'root'
})
export class ShowOrderViewService {

  orderResponse = new BehaviorSubject<ShowOrderResponse | null>(null)

  otherUserOrderEntries = new BehaviorSubject<Array<ParticipantsOrderEntry>>([])

  modifyOrderEntryState = new BehaviorSubject<ModifyOrderEntryState>(initialModifyOrderEntryState)

  showOrderViewState$: Observable<ShowOrderViewState> = this.createShowOrderViewStateObservable()

  constructor(private orderControllerService: OrderControllerService,
              private errorSnackBarService: ErrorSnackBarService,
              private orderEntryControllerService: OrderEntryControllerService,
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

  reloadOrderResponse(): Observable<void> {
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

  modifyOrderEntryStateAsObservable() {
    return this.modifyOrderEntryState.asObservable()
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

        let priceSummaryInput: PriceSummaryInput = {
          deliveryData: r.order.deliveryData,
          basePriceSum: r.baseOrderPrice,
          totalPrice: r.totalOrderPrice,
          allEatingPeopleCount: r.orderEntries.flatMap(e => e.dishEntries).length,
        }

        let shouldShowOrderLockedWarning = isOrderOwner && [OrderStateEnum.ORDERING].includes(order.orderState);

        let obj: ShowOrderViewState = {
          canShowPlaceOrderButton: canShowPlaceOrderButton,
          isPlaceOrderButtonDisabled: isPlaceOrderButtonDisabled,
          canShowMarkAsDeliveredButton: canShowMarkAsDeliveredButton,
          shouldDisplayNewOrderEntryCard: shouldDisplayNewOrderEntryCard,
          shouldShowQRCodeButton: shouldShowQRCodeButton,
          isOrderOwner: isOrderOwner,
          allEatingPeopleCount: allEatingPeopleCount,
          numberOfCurrentUserEntries: numberOfCurrentUserEntries,
          username: username,
          yourOrderEntries: yourOrderEntries,
          priceSummaryInput: priceSummaryInput,
          shouldShowOrderLockedWarning: shouldShowOrderLockedWarning,
        }
        return obj
      })
    );
  }

  setEntryLoading(newValue: boolean) {
    this.modifyOrderEntryState.next(
      {
        ...this.modifyOrderEntryState.value,
        loadingEntry: newValue,
      }
    )
  }

  setDishEntryCreating() {
    this.modifyOrderEntryState.next(
      {
        ...this.modifyOrderEntryState.value,
        isEntryCreating: true,
        isEntryEdited: false,
        orderEntryId: "",
        dishEntryId: ""
      }
    )
  }

  setDishEntryEditing(payload: { orderEntryId: string, dishEntryId: string }) {
    this.modifyOrderEntryState.next(
      {
        ...this.modifyOrderEntryState.value,
        isEntryCreating: false,
        isEntryEdited: true,
        orderEntryId: payload.orderEntryId,
        dishEntryId: payload.dishEntryId,
      }
    )
  }

  cancelDishEntryModification() {
    this.modifyOrderEntryState.next(
      {
        ...this.modifyOrderEntryState.value,
        isEntryCreating: false,
        isEntryEdited: false,
        orderEntryId: "",
        dishEntryId: "",
      }
    )
  }

  deleteDishEntry(params: { orderEntryId: string; dishEntryId: string }): Observable<void> {
    return this.orderEntryControllerService.delete1(params.orderEntryId, params.dishEntryId)
      .pipe(
        switchMap(() => {
          return this.reloadOrderResponse()
        }),
      )
  }

  doSaveOrderEntry(orderEntryToSave: OrderEntrySaveRequest) {
    return this.orderEntryControllerService
      .save1(orderEntryToSave)
      .pipe(
        tap(() => this.setEntryLoading(true)),
        tap(() => this.cancelDishEntryModification()),
        switchMap(() => this.reloadOrderResponse()),
        catchError(error => {
          this.errorSnackBarService.displayError(error)
          throw error
        })
      )
  }

  doUpdateOrderEntry(orderEntryToUpdate: OrderEntryUpdateRequest): Observable<void> {
    return this.orderEntryControllerService
      .update1(orderEntryToUpdate)
      .pipe(
        tap(() => this.setEntryLoading(true)),
        tap(() => this.cancelDishEntryModification()),
        switchMap(() => this.reloadOrderResponse()),
        catchError(error => {
          this.errorSnackBarService.displayError(error)
          throw error
        })
      )
  }

  setAsDelivered(orderId: string) {
    this.orderControllerService.setAsDelivered(orderId)
      .pipe(
        switchMap(() => this.reloadOrderResponse())
      )
      .subscribe()
  }

  unlockOrderAndReload(orderId: string) {
    this.orderControllerService.setAsCreated(orderId)
      .pipe(
        switchMap(() => this.reloadOrderResponse())
      )
      .subscribe()
  }

  confirmAsPaid(orderEntryId: string) {
    this.orderEntryControllerService.setAsConfirmedAsPaid(orderEntryId)
      .pipe(
        switchMap(() => this.reloadOrderResponse())
      )
      .subscribe()
  }

  revertToUnpaid(orderEntryId: string) {
    this.orderEntryControllerService.revertToUnpaid(orderEntryId)
      .pipe(
        switchMap(() => this.reloadOrderResponse())
      )
      .subscribe()
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
}

function isNonNullGuard<T>(value: T): value is NonNullable<T> {
  return value != null;
}
