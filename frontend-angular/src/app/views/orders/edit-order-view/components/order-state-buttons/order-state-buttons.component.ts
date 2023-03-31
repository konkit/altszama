import {Component, Input} from '@angular/core';
import {OrderControllerService, ShowOrderDto} from "../../../../../../frontend-client";
import OrderStateEnum = ShowOrderDto.OrderStateEnum;
import {Router} from "@angular/router";
import {EMPTY, switchMap, tap} from "rxjs";
import {DialogService} from "../../../../../service/dialog.service";

@Component({
  selector: 'app-order-state-buttons',
  templateUrl: './order-state-buttons.component.html',
  styleUrls: ['./order-state-buttons.component.scss']
})
export class OrderStateButtonsComponent {

  @Input() orderId!: string
  @Input() orderState!: OrderStateEnum

  constructor(private router: Router,
              private orderControllerService: OrderControllerService,
              private dialogService: DialogService) {
  }

  setAsCreated() {
    this.orderControllerService.setAsCreated(this.orderId)
      .subscribe({
        next: r => this.router.navigate(["/orders", this.orderId, 'show']),
        error: err => console.log(err)
      })
  }

  setAsOrdered() {
    this.orderControllerService.setBackAsOrdered(this.orderId)
      .subscribe({
        next: r => this.router.navigate(["/orders", this.orderId, 'show']),
        error: err => console.log(err)
      })
  }

  setAsRejected() {
    this.orderControllerService.setAsRejected(this.orderId)
      .subscribe({
        next: r => this.router.navigate(["/orders", this.orderId, 'show']),
        error: err => console.log(err)
      })
  }

  deleteOrder() {
    this.dialogService.displayDeleteDialog("Delete order?", "Are you sure you want to delete this order?")
      .afterClosed()
      .pipe(
        switchMap(confirmed => {
          if (confirmed) {
            return this.orderControllerService._delete(this.orderId)
              .pipe(
                tap(() => {
                  this.router.navigate(['/orders/all'], {onSameUrlNavigation: "reload"})
                })
              )
          } else {
            return EMPTY;
          }
        })
      )
      .subscribe()
  }
}
