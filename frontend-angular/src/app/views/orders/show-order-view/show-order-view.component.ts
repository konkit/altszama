import {Component, OnInit} from '@angular/core';
import {ParticipantsOrderEntry, ShowOrderResponse} from "../../../../frontend-client";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable, take} from "rxjs";
import {ModifyOrderEntryState, ShowOrderViewService, ShowOrderViewState} from "./service/show-order-view.service";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-show-order-view',
  templateUrl: './show-order-view.component.html',
  styleUrls: ['./show-order-view.component.scss']
})
export class ShowOrderViewComponent implements OnInit {

  orderResponse$: Observable<ShowOrderResponse>
  otherUserOrderEntries$: Observable<Array<ParticipantsOrderEntry>>
  showOrderViewState$: Observable<ShowOrderViewState>
  modifyOrderEntryState$: Observable<ModifyOrderEntryState>;


  constructor(private route: ActivatedRoute,
              private router: Router,
              private readonly title: Title,
              private showOrderViewService: ShowOrderViewService) {
    this.orderResponse$ = this.showOrderViewService.orderResponseAsObservable()
    this.otherUserOrderEntries$ = this.showOrderViewService.otherUserOrderEntriesAsObservable()
    this.showOrderViewState$ = this.showOrderViewService.getShowOrderViewState();
    this.modifyOrderEntryState$ = this.showOrderViewService.modifyOrderEntryStateAsObservable()
  }

  ngOnInit() {
    this.showOrderViewService.handleOrderChangeSSE()

    this.orderResponse$.pipe(take(1)).subscribe(orderResponse => {
      let order = orderResponse.order;
      this.title.setTitle(`[${order.orderState}] Order from ${order.restaurantName} (${order.orderDate}) | AltSzama`)
    })
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

  unlockOrder() {
    this.showOrderViewService.unlockOrderAndReload(this.getOrderId())
  }
}
