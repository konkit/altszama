import {Component} from '@angular/core';
import {ShowOrderResponse} from "../../../../frontend-client";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable} from "rxjs";
import {ModifyOrderEntryState, ShowOrderViewService, ShowOrderViewState} from "./service/show-order-view.service";


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
              private showOrderViewService: ShowOrderViewService) {
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

  getOrderId() {
    return this.route.snapshot.paramMap.get('id')!
  }
}
