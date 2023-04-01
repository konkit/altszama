import {Component} from '@angular/core';
import {ShowOrderResponse} from "../../../../frontend-client";
import {ActivatedRoute, Router} from "@angular/router";
import {EMPTY, Observable, switchMap, tap} from "rxjs";
import {ModifyOrderEntryState, ShowOrderViewService, ShowOrderViewState} from "./service/show-order-view.service";
import {DialogService} from "../../../service/dialog.service";

@Component({
  selector: 'app-show-order-view',
  templateUrl: './show-order-view.component.html',
  styleUrls: ['./show-order-view.component.scss']
})
export class ShowOrderViewComponent {

  orderResponse$: Observable<ShowOrderResponse>
  showOrderViewState$: Observable<ShowOrderViewState>
  modifyOrderEntryState$: Observable<ModifyOrderEntryState>;


  constructor(private route: ActivatedRoute,
              private router: Router,
              private showOrderViewService: ShowOrderViewService,
              private dialogService: DialogService) {
    this.orderResponse$ = this.showOrderViewService.orderResponseAsObservable()
    this.showOrderViewState$ = this.showOrderViewService.getShowOrderViewState();
    this.modifyOrderEntryState$ = this.showOrderViewService.modifyOrderEntryStateAsObservable()
  }

  shouldShowOrderLockedWarning() {
    return false;
  }

  placeOrder() {
    this.router.navigate(["/orders", this.getOrderId(), "make_an_order"])
  }

  goToEditOrder() {
    this.router.navigate(["/orders", this.getOrderId(), "edit"])
  }

  setAsDelivered() {
    this.showOrderViewService.setAsDelivered(this.getOrderId())
  }

  getOrderId(): string {
    return this.route.snapshot.paramMap.get('id')!
  }

  deleteOrder() {
    this.dialogService.displayDeleteDialog("Delete order?", "Are you sure you want to delete this order?")
      .afterClosed()
      .pipe(
        switchMap(confirmed => {
          if (confirmed) {
            return this.showOrderViewService.deleteOrder(this.getOrderId())
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

  unlockOrder() {
    this.showOrderViewService.unlockOrderAndReload(this.getOrderId())
  }
}
