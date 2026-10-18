import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {Observable, take} from "rxjs";
import {ShowOrderViewService} from "./service/show-order-view.service";
import {Title} from "@angular/platform-browser";
import {NavigationHistoryService} from "../../../service/navigation-history.service";
import {ShowOrderViewState} from "../lib/model";
import {ShowOrderDto} from "../../../../frontend-client";
import {orderStateToCaption, orderStateToTone} from "../lib/orderState";
import {OrderEntriesListComponent} from './components/order-entries-list/order-entries-list.component';
import {
  OrderLockedWarningBannerComponent
} from './components/order-locked-warning-banner/order-locked-warning-banner.component';
import {OrderOwnerButtonsComponent} from './components/order-owner-buttons/order-owner-buttons.component';
import {OrderProgressComponent} from './components/order-progress/order-progress.component';
import {OrderNextStepComponent} from './components/order-next-step/order-next-step.component';
import {OrderSummaryPanelComponent} from './components/order-summary-panel/order-summary-panel.component';
import {ChipComponent, ChipTone} from '../../../components/chip/chip.component';
import {ViewWrapperComponent} from '../../../components/view-wrapper/view-wrapper.component';
import {AsyncPipe} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import OrderStateEnum = ShowOrderDto.OrderStateEnum;

// Views that link to an order and should be returned to with "Back"
const BACK_LINK_ORIGINS = ['/orders/all', '/balance']

@Component({
    selector: 'app-show-order-view',
    templateUrl: './show-order-view.component.html',
    styleUrls: ['./show-order-view.component.scss'],
    standalone: true,
  imports: [ViewWrapperComponent, ChipComponent, OrderOwnerButtonsComponent, OrderLockedWarningBannerComponent, OrderProgressComponent, OrderNextStepComponent, OrderSummaryPanelComponent, OrderEntriesListComponent, AsyncPipe, MatButton, MatIcon, RouterLink]
})
export class ShowOrderViewComponent implements OnInit, OnDestroy {

  showOrderViewState$: Observable<ShowOrderViewState>

  backLink: string

  protected readonly OrderStateEnum = OrderStateEnum;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private readonly title: Title,
              private showOrderViewService: ShowOrderViewService,
              navigationHistory: NavigationHistoryService) {
    this.showOrderViewState$ = this.showOrderViewService.getShowOrderViewState();

    let previousUrl = navigationHistory.getPreviousUrl()
    this.backLink = previousUrl && BACK_LINK_ORIGINS.some(origin => previousUrl.startsWith(origin))
      ? previousUrl
      : '/orders/today'
  }

  ngOnInit() {
    this.showOrderViewService.handleOrderChangeSSE()

    this.showOrderViewState$
      .pipe(take(1))
      .subscribe(viewState => {
        let order = viewState.order;
        this.title.setTitle(`${order.restaurantName} (${orderStateToCaption(order.orderState)}, ${order.orderDate}) | AltSzama`)
      })
  }

  ngOnDestroy() {
    this.showOrderViewService.stopOrderChangeSSE()
  }

  getOrderStateString(orderState: OrderStateEnum): string {
    return orderStateToCaption(orderState)
  }

  getOrderStateTone(orderState: OrderStateEnum): ChipTone {
    return orderStateToTone(orderState)
  }
}
