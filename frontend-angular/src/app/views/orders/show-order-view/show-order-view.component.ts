import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Observable, take} from "rxjs";
import {ShowOrderViewService} from "./service/show-order-view.service";
import {Title} from "@angular/platform-browser";
import {ShowOrderViewState} from "../lib/model";
import {ShowOrderDto} from "../../../../frontend-client";
import {orderStateToCaption} from "../lib/orderState";
import OrderStateEnum = ShowOrderDto.OrderStateEnum;

@Component({
  selector: 'app-show-order-view',
  templateUrl: './show-order-view.component.html',
  styleUrls: ['./show-order-view.component.scss']
})
export class ShowOrderViewComponent implements OnInit {

  showOrderViewState$: Observable<ShowOrderViewState>


  constructor(private route: ActivatedRoute,
              private router: Router,
              private readonly title: Title,
              private showOrderViewService: ShowOrderViewService) {
    this.showOrderViewState$ = this.showOrderViewService.getShowOrderViewState();
  }

  ngOnInit() {
    this.showOrderViewService.handleOrderChangeSSE()

    this.showOrderViewState$
      .pipe(take(1))
      .subscribe(viewState => {
        let order = viewState.order;
        this.title.setTitle(`[${order.orderState}] Order from ${order.restaurantName} (${order.orderDate}) | AltSzama`)
      })
  }

  getOrderStateString(orderState: OrderStateEnum): string {
    return orderStateToCaption(orderState)
  }
}
