import {Injectable} from '@angular/core';
import {BehaviorSubject, EMPTY, filter, map, Observable, tap} from "rxjs";
import {
  OrderControllerService,
  OrderEntryControllerService,
  ShowOrderResponse,
  SideDishData
} from "../../../../../frontend-client";


export interface NewDishData {
  kind: "NewDishData";
  newDishName: string;
  newDishPrice: number;
  chosenSideDishes: SideDishData[];
}

export interface ExistingDishData {
  kind: "ExistingDishData";
  dishId: string;
  chosenSideDishes: SideDishData[];
}

export interface OrderEntryData {
  dishData: NewDishData | ExistingDishData;
  additionalComments: string;
}

export interface ModifyOrderEntryState {
  loadingEntry: boolean;

  isEntryCreating: boolean;
  isEntryEdited: boolean;
  orderEntryId: string;
  dishEntryId: string;
}

const initialModifyOrderEntryState: ModifyOrderEntryState = {
  loadingEntry: false,

  isEntryCreating: false,
  isEntryEdited: false,
  orderEntryId: "",
  dishEntryId: "",
};


@Injectable({
  providedIn: 'root'
})
export class ShowOrderViewService {

  orderResponse = new BehaviorSubject<ShowOrderResponse | null>(null)

  modifyOrderEntryState = new BehaviorSubject<ModifyOrderEntryState>(initialModifyOrderEntryState)

  constructor(private orderControllerService: OrderControllerService) {
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


  setInitialCreateOrderEntry(param: { orderId: string; dishId: any }) {
    this.modifyOrderEntryState.next(
      {
        ...this.modifyOrderEntryState.value,
      }
    )
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

  updateOrderEntryData(newValue: OrderEntryData) {
    this.modifyOrderEntryState.next(
      {
        ...this.modifyOrderEntryState.value,
      }
    )
  }

  // fetchOrderDataAction(orderId) {
  //   this.orderControllerService
  //     .fetchOrder(orderId)
  //     .then(showOrderData => {
  //       this.commit("showOrder/loadShowOrderData",showOrderData);
  //       this.commit("setLoadingFalse");
  //       this.commit("setTitle", `[${state.order.orderState}] Order from ${state.order.restaurantName} (${state.order.orderDate})`)
  //     })
  //     .catch(errResponse => ErrorHandler.handleError(errResponse));
  // }

}
