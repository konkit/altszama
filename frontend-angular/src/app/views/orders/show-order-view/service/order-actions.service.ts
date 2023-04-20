import {Injectable} from '@angular/core';
import {switchMap} from "rxjs";
import {ShowOrderViewService} from "./show-order-view.service";
import {OrderControllerService, OrderEntryControllerService} from "../../../../../frontend-client";
import {MatDialog} from "@angular/material/dialog";

@Injectable({
  providedIn: 'root'
})
export class OrderActionsService {

  constructor(private orderControllerService: OrderControllerService,
              private orderEntryControllerService: OrderEntryControllerService,
              private dialog: MatDialog,
              private showOrderViewService: ShowOrderViewService) { }

  setAsDelivered(orderId: string) {
    this.orderControllerService.setAsDelivered(orderId)
      .pipe(
        switchMap(() => this.showOrderViewService.reloadWholeOrderResponse())
      )
      .subscribe()
  }

  unlockOrderAndReload(orderId: string) {
    this.orderControllerService.setAsCreated(orderId)
      .pipe(
        switchMap(() => this.showOrderViewService.reloadWholeOrderResponse())
      )
      .subscribe()
  }

  confirmAsPaid(orderEntryId: string) {
    this.orderEntryControllerService.setAsConfirmedAsPaid(orderEntryId)
      .pipe(
        switchMap(() => this.showOrderViewService.reloadWholeOrderResponse())
      )
      .subscribe()
  }

  revertToUnpaid(orderEntryId: string) {
    this.orderEntryControllerService.revertToUnpaid(orderEntryId)
      .pipe(
        switchMap(() => this.showOrderViewService.reloadWholeOrderResponse())
      )
      .subscribe()
  }
}
