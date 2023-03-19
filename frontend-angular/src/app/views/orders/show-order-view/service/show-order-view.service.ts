import {Injectable} from '@angular/core';
import {BehaviorSubject, EMPTY, filter, map, Observable, switchMap, take, tap} from "rxjs";
import {
  OrderControllerService,
  OrderEntryControllerService,
  OrderEntryUpdateRequest,
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
  dishEntryId: string;
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

  constructor(private orderControllerService: OrderControllerService,
              private orderEntryControllerService: OrderEntryControllerService) {
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

  isModifiedEntryCreating(): boolean {
    // return this.$store.state.modifyOrderEntry.isEntryCreating;
    return false;
  }

  isModifiedEntryEdited(): boolean {
    // return this.$store.state.modifyOrderEntry.isEntryEdited;
    return false;
  }

  getModifiedDishEntryId(): string {
    // return this.$store.state.modifyOrderEntry.dishEntryId;
    return "0";
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

  saveOrderEntry(params: {
    orderId: string,
    formValue: {
      name: string,
      price: number,
      additionalComments: string,
    }
  }): Observable<void> {
    let orderEntryToSave = {
      orderId: params.orderId,
      dishId: "",
      newDish: true,
      newDishName: params.formValue.name,
      newDishPrice: params.formValue.price,
      additionalComments: params.formValue.additionalComments,
      sideDishes: [],
    };

    return this.orderEntryControllerService
      .save1(orderEntryToSave)
      .pipe(
        tap(() => this.setEntryLoading(true)),
        tap(() => this.cancelDishEntryModification()),
        switchMap(() => this.reloadOrderResponse()),
      )
  }

  updateOrderEntry(params: {
    orderId: string,
    orderEntryId: string,
    dishEntryId: string,
    formValue: { additionalComments: string, name: string, price: number }
  }): Observable<void> {
    let orderEntryToUpdate: OrderEntryUpdateRequest
    orderEntryToUpdate = {
      id: params.orderEntryId,
      orderId: params.orderId,
      dishEntryId: params.dishEntryId,
      newDish: true,
      dishId: "",
      additionalComments: params.formValue.additionalComments,
      newDishName: params.formValue.name,
      newDishPrice: params.formValue.price,
      sideDishes: [],
    };

    return this.doUpdateOrderEntry(orderEntryToUpdate)

    // const dishData: (NewDishData | ExistingDishData) = state.orderEntryData.dishData
    // if (dishData.kind === "NewDishData") {
    //   orderEntryToUpdate = {
    //     orderId: orderId,
    //     dishId: "",
    //     dishEntryId: state.dishEntryId,
    //     additionalComments: state.orderEntryData.additionalComments,
    //     newDish: true,
    //     newDishName: dishData.newDishName,
    //     newDishPrice: dishData.newDishPrice,
    //     chosenSideDishes: dishData.chosenSideDishes
    //   };
    // } else {
    //   orderEntryToUpdate = {
    //     orderId: orderId,
    //     dishId: dishData.dishId,
    //     dishEntryId: state.dishEntryId,
    //     additionalComments: state.orderEntryData.additionalComments,
    //     newDish: false,
    //     newDishName: "",
    //     newDishPrice: 0,
    //     chosenSideDishes: dishData.chosenSideDishes
    //   };
    // }
  }

  private doUpdateOrderEntry(orderEntryToUpdate: OrderEntryUpdateRequest): Observable<void> {
    return this.orderEntryControllerService
      .update1(orderEntryToUpdate)
      .pipe(
        tap(() => this.setEntryLoading(true)),
        tap(() => this.cancelDishEntryModification()),
        switchMap(() => this.reloadOrderResponse()),
      )
  }
}
