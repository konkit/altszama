import {Injectable} from '@angular/core';
import {BehaviorSubject, EMPTY, filter, map, Observable, switchMap, take, tap} from "rxjs";
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
import OrderStateEnum = ShowOrderDto.OrderStateEnum;

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
  otherUsersOrderEntries: ParticipantsOrderEntry[],
  yourAndOtherUsersOrderEntries: ParticipantsOrderEntry[],
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

  modifyOrderEntryState = new BehaviorSubject<ModifyOrderEntryState>(initialModifyOrderEntryState)

  showOrderViewState$: Observable<ShowOrderViewState> = this.createShowOrderViewStateObservable()

  constructor(private orderControllerService: OrderControllerService,
              private orderEntryControllerService: OrderEntryControllerService,
              private authService: AuthService) {
  }

  loadOrderResponse(id: string | null): Observable<ShowOrderResponse> {
    if (id != null) {
      return this.orderControllerService.show(id)
        .pipe(
          tap(response => this.orderResponse.next(response))
        )
    } else {
      return EMPTY;
    }
  }

  orderResponseAsObservable(): Observable<ShowOrderResponse> {
    return this.orderResponse.asObservable().pipe(
      filter(x => x != null),
      map(x => x!)
    )
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
        let otherUsersOrderEntries = orderEntries.filter(e => e.userId !== currentUserId);

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
          otherUsersOrderEntries: otherUsersOrderEntries,
          yourAndOtherUsersOrderEntries: [...yourOrderEntries, ...otherUsersOrderEntries],
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

  reloadOrderResponse(): Observable<void> {
    return this.orderResponse.pipe(
      take(1),
      map(r => r!.order.id),
      switchMap(orderId => {
        return this.loadOrderResponse(orderId)
      }),
      map(() => void 0)
    )
  }

  doSaveOrderEntry(orderEntryToSave: OrderEntrySaveRequest) {
    return this.orderEntryControllerService
      .save1(orderEntryToSave)
      .pipe(
        tap(() => this.setEntryLoading(true)),
        tap(() => this.cancelDishEntryModification()),
        switchMap(() => this.reloadOrderResponse()),
      )
  }

  doUpdateOrderEntry(orderEntryToUpdate: OrderEntryUpdateRequest): Observable<void> {
    return this.orderEntryControllerService
      .update1(orderEntryToUpdate)
      .pipe(
        tap(() => this.setEntryLoading(true)),
        tap(() => this.cancelDishEntryModification()),
        switchMap(() => this.reloadOrderResponse()),
      )
  }

  setAsDelivered(orderId: string) {
    this.orderControllerService.setAsDelivered(orderId)
      .pipe(
        switchMap(() => this.reloadOrderResponse())
      )
      .subscribe()
  }

  deleteOrder(orderId: string): Observable<string> {
    return this.orderControllerService._delete(orderId)
  }

  unlockOrderAndReload(orderId: string) {
    this.orderControllerService.setAsCreated(orderId)
      .pipe(
        switchMap(() => this.reloadOrderResponse())
      )
      .subscribe()
  }
}

function isNonNullGuard<T>(value: T): value is NonNullable<T> {
  return value != null;
}
