import { Component, ChangeDetectionStrategy } from '@angular/core';
import { map, Observable } from 'rxjs';
import { OrderEntryDto, TodayOrderDto, TodayOrdersResponse } from '../../../../frontend-client';
import { ActivatedRoute, Router } from '@angular/router';
import { orderStateToCaption, orderStateToTone } from '../lib/orderState';
import { ViewWrapperComponent } from '../../../components/view-wrapper/view-wrapper.component';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { AsyncPipe } from '@angular/common';
import { ChipComponent, ChipTone } from '../../../components/chip/chip.component';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../../service/auth.service';
import OrderStateEnum = TodayOrderDto.OrderStateEnum;

interface TodayOrderCard {
  order: TodayOrderDto
  isCreatedByYou: boolean
  yourDishNames: string[]
}

interface TodayOrdersViewData {
  cards: TodayOrderCard[]
  hasYourEntries: boolean
}

@Component({
  selector: 'app-today-orders-view',
  imports: [
    ViewWrapperComponent,
    MatIcon,
    MatButton,
    AsyncPipe,
    ChipComponent,
    MatCardModule,
  ],
  templateUrl: './today-orders-view.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './today-orders-view.component.scss'
})
export class TodayOrdersViewComponent {
  viewData$: Observable<TodayOrdersViewData>;

  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService) {
    this.viewData$ = this.route.data.pipe(map(x => this.toViewData(x['response'])))
  }

  // One card per order: your own dishes are shown inside the order's card instead of in a separate list
  private toViewData(response: TodayOrdersResponse): TodayOrdersViewData {
    const currentUserId = this.authService.getLoggedUser()?.userId

    const cards = response.ordersList.map(order => {
      const yourEntries: OrderEntryDto[] = response.currentOrderEntries.filter(e => e.orderId === order.id)
      return {
        order,
        isCreatedByYou: order.orderCreatorId === currentUserId,
        yourDishNames: yourEntries.flatMap(e => e.dishEntries).map(d => d.dish.name),
      }
    })

    // Orders you're part of come first
    const isYours = (card: TodayOrderCard) => card.isCreatedByYou || card.yourDishNames.length > 0
    cards.sort((a, b) => Number(isYours(b)) - Number(isYours(a)))

    return {cards, hasYourEntries: response.currentOrderEntries.length > 0}
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

  getOrderStateTone(orderState: OrderStateEnum): ChipTone {
    return orderStateToTone(orderState)
  }
}
