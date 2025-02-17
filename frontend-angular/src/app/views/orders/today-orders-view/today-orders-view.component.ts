import {Component} from '@angular/core';
import {map, Observable} from 'rxjs';
import {TodayOrderDto, TodayOrdersResponse} from '../../../../frontend-client';
import {ActivatedRoute, Router} from '@angular/router';
import {orderStateToCaption} from "../lib/orderState"
import {ViewWrapperComponent} from '../../../components/view-wrapper/view-wrapper.component';
import {MatActionList, MatList, MatListItem} from '@angular/material/list';
import {MatIcon} from '@angular/material/icon';
import {MatButton} from '@angular/material/button';
import {AsyncPipe} from '@angular/common';
import {ChipComponent} from '../../../components/chip/chip.component';
import OrderStateEnum = TodayOrderDto.OrderStateEnum;

@Component({
  selector: 'app-today-orders-view',
  imports: [
    ViewWrapperComponent,
    MatActionList,
    MatListItem,
    MatList,
    MatIcon,
    MatButton,
    AsyncPipe,
    ChipComponent
  ],
  templateUrl: './today-orders-view.component.html',
  standalone: true,
  styleUrl: './today-orders-view.component.scss'
})
export class TodayOrdersViewComponent {
  todaysOrders$: Observable<TodayOrdersResponse>;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.todaysOrders$ = this.route.data.pipe(map(x => x['response']))
  }

  goToOrder(selectedOrderId: string) {
    return this.router.navigate(["/orders/", selectedOrderId, 'show']);
  }

  goToCreateOrder() {
    return this.router.navigate(["/orders/create"])
  }

  getOrderStateString(orderState: OrderStateEnum): string {
    return orderStateToCaption(orderState)
  }

}
