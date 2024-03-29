import {Injectable} from '@angular/core';
import {BehaviorSubject, catchError, Observable, switchMap, tap} from "rxjs";
import {ModifyOrderEntryState} from "../../../../lib/model";
import {
  OrderEntryControllerService,
  OrderEntrySaveRequest,
  OrderEntryUpdateRequest
} from "../../../../../../../frontend-client";
import {ErrorSnackBarService} from "../../../../../../service/error-snack-bar.service";
import {ShowOrderViewService} from "../../../service/show-order-view.service";


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
export class ModifyOrderEntryService {

  modifyOrderEntryState = new BehaviorSubject<ModifyOrderEntryState>(initialModifyOrderEntryState)

  constructor(private orderEntryControllerService: OrderEntryControllerService,
              private errorSnackBarService: ErrorSnackBarService,
              private showOrderViewService: ShowOrderViewService) { }

  modifyOrderEntryStateAsObservable() {
    return this.modifyOrderEntryState.asObservable()
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
    console.log("cancelDishEntryModification", new Date())
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

  doSaveOrderEntry(orderEntryToSave: OrderEntrySaveRequest) {
    return this.orderEntryControllerService
      .save1(orderEntryToSave)
      .pipe(
        switchMap(() => this.showOrderViewService.loadOrderResponseToAllSubjects(orderEntryToSave.orderId)),
        tap(() => this.cancelDishEntryModification()),
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
        switchMap(() => this.showOrderViewService.reloadWholeOrderResponse()),
        tap(() => this.cancelDishEntryModification()),
        catchError(error => {
          this.errorSnackBarService.displayError(error)
          throw error
        })
      )
  }

  deleteDishEntry(params: { orderEntryId: string; dishEntryId: string }): Observable<void> {
    return this.orderEntryControllerService.delete1(params.orderEntryId, params.dishEntryId)
      .pipe(
        switchMap(() => {
          return this.showOrderViewService.reloadWholeOrderResponse()
        }),
      )
  }
}
