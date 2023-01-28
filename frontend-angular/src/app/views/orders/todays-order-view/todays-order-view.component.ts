import { Component } from '@angular/core';
import {map, Observable} from "rxjs";
import {AllOrdersOrderDto, OrderControllerService, TodayOrderDto} from "../../../../frontend-client";

@Component({
  selector: 'app-todays-order-view',
  templateUrl: './todays-order-view.component.html',
  styleUrls: ['./todays-order-view.component.scss']
})
export class TodaysOrderViewComponent {

  todaysOrders$: Observable<TodayOrderDto[]>;

  constructor(private api: OrderControllerService) {
    this.todaysOrders$ = this.api.todayOrders().pipe(
      map(r => r.ordersList)
    )
  }

}
