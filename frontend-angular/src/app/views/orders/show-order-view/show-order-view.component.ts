import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Observable, take} from "rxjs";
import {ShowOrderViewService} from "./service/show-order-view.service";
import {Title} from "@angular/platform-browser";
import {ShowOrderViewState} from "../lib/model";
import {ShowOrderDto} from "../../../../frontend-client";
import {orderStateToCaption} from "../lib/orderState";
import {OrderEntriesListComponent} from './components/order-entries-list/order-entries-list.component';
import {OrderDetailsComponent} from './components/order-details/order-details.component';
import {
  OrderLockedWarningBannerComponent
} from './components/order-locked-warning-banner/order-locked-warning-banner.component';
import {OrderOwnerButtonsComponent} from './components/order-owner-buttons/order-owner-buttons.component';
import {ChipComponent} from '../../../components/chip/chip.component';
import {ViewWrapperComponent} from '../../../components/view-wrapper/view-wrapper.component';
import {AsyncPipe} from '@angular/common';
import OrderStateEnum = ShowOrderDto.OrderStateEnum;

@Component({
    selector: 'app-show-order-view',
    templateUrl: './show-order-view.component.html',
    styleUrls: ['./show-order-view.component.scss'],
    standalone: true,
    imports: [ViewWrapperComponent, ChipComponent, OrderOwnerButtonsComponent, OrderLockedWarningBannerComponent, OrderDetailsComponent, OrderEntriesListComponent, AsyncPipe]
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
