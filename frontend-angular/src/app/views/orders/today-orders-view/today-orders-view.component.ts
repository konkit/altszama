import {Component} from '@angular/core';
import {map, Observable} from "rxjs";
import {TodayOrderDto, TodayOrdersResponse} from "../../../../frontend-client";
import {ActivatedRoute, Router} from "@angular/router";
import {orderStateToCaption} from "../lib/orderState"
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatListModule} from '@angular/material/list';
import {AsyncPipe, NgFor, NgIf} from '@angular/common';
import {ViewWrapperComponent} from '../../../components/view-wrapper/view-wrapper.component';
import OrderStateEnum = TodayOrderDto.OrderStateEnum;

@Component({
    selector: 'app-today-orders-view',
    templateUrl: './today-orders-view.component.html',
    styleUrls: ['./today-orders-view.component.scss'],
    standalone: true,
    imports: [ViewWrapperComponent, NgIf, MatListModule, NgFor, MatButtonModule, MatIconModule, AsyncPipe]
})
export class TodayOrdersViewComponent {

  todaysOrders$: Observable<TodayOrdersResponse>;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.todaysOrders$ = this.route.data.pipe(map(x => x['response']))
  }

  goToOrder(selectedOrderId: string) {
    return this.router.navigate(["/orders/", selectedOrderId, 'show']);
    // router.push({name: "ShowOrder", params: {id: selectedOrderId}});
  }

  goToCreateOrder() {
    return this.router.navigate(["/orders/create"])
  }

  getOrderStateString(orderState: OrderStateEnum): string {
    return orderStateToCaption(orderState)
  }

}
