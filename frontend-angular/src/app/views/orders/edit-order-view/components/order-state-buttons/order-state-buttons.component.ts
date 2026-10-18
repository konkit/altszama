import {Component, input} from '@angular/core';
import {OrderControllerService, ShowOrderDto} from "../../../../../../frontend-client";
import {Router} from "@angular/router";
import {catchError, EMPTY, filter, switchMap, tap} from "rxjs";
import {DialogService} from "../../../../../service/dialog.service";
import {ErrorSnackBarService} from "../../../../../service/error-snack-bar.service";
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';

import OrderStateEnum = ShowOrderDto.OrderStateEnum;

@Component({
    selector: 'app-order-state-buttons',
    templateUrl: './order-state-buttons.component.html',
    styleUrls: ['./order-state-buttons.component.scss'],
    standalone: true,
    imports: [MatButtonModule, MatIconModule]
})
export class OrderStateButtonsComponent {

  readonly orderId = input.required<string>();
  readonly orderState = input.required<OrderStateEnum>();

  constructor(private router: Router,
              private orderControllerService: OrderControllerService,
              private errorSnackBar: ErrorSnackBarService,
              private dialogService: DialogService) {
  }

  setAsCreated() {
    this.orderControllerService.setAsCreated(this.orderId())
      .subscribe({
        next: r => this.router.navigate(["/orders", this.orderId(), 'show']),
        error: err => this.errorSnackBar.displayError(err)
      })
  }

  setAsOrdered() {
    this.orderControllerService.setBackAsOrdered(this.orderId())
      .subscribe({
        next: r => this.router.navigate(["/orders", this.orderId(), 'show']),
        error: err => this.errorSnackBar.displayError(err)
      })
  }

  setAsRejected() {
    this.dialogService.displayConfirmDialog("Mark as rejected?", "Use this when the restaurant can't take the order. Participants will see it as rejected.", "Mark as rejected")
      .afterClosed()
      .pipe(
        filter(confirmed => confirmed === true),
        switchMap(() => this.orderControllerService.setAsRejected(this.orderId()))
      )
      .subscribe({
        next: r => this.router.navigate(["/orders", this.orderId(), 'show']),
        error: err => this.errorSnackBar.displayError(err)
      })
  }

  canReopen() {
    return this.orderState() === OrderStateEnum.Ordering || this.orderState() === OrderStateEnum.Ordered
  }

  canRestoreToOrdered() {
    return this.orderState() === OrderStateEnum.Delivered || this.orderState() === OrderStateEnum.Rejected
  }

  canReject() {
    return this.orderState() !== OrderStateEnum.Rejected
  }

  deleteOrder() {
    this.dialogService.displayDeleteDialog("Delete order?", "Are you sure you want to delete this order?")
      .afterClosed()
      .pipe(
        switchMap(confirmed => {
          if (confirmed) {
            return this.orderControllerService._delete(this.orderId())
              .pipe(
                tap(() => {
                  this.router.navigate(['/orders/all'], {onSameUrlNavigation: "reload"})
                })
              )
          } else {
            return EMPTY;
          }
        }),
        catchError(err => {
          this.errorSnackBar.displayError(err)
          throw err
        }),
      )
      .subscribe()
  }
}
