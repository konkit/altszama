import { Component } from '@angular/core';
import {map, Observable} from "rxjs";
import {
  AllOrdersOrderDto,
  OrderControllerService,
  TodayOrderDto,
  TodayOrdersResponse
} from "../../../../frontend-client";
import {faAdd} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-todays-order-view',
  templateUrl: './todays-order-view.component.html',
  styleUrls: ['./todays-order-view.component.scss']
})
export class TodaysOrderViewComponent {

  todaysOrders$: Observable<TodayOrdersResponse>;

  faAdd = faAdd

  constructor(private api: OrderControllerService) {
    this.todaysOrders$ = this.api.todayOrders()
  }

  goToOrder(selectedOrderId: string) {
    // router.push({name: "ShowOrder", params: {id: selectedOrderId}});
  }

  goToCreateOrder() {
    // router.push({name: "OrderCreateForm"});
  }

}
