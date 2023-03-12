import {Component, OnInit} from '@angular/core';
import {OrderControllerService, ShowOrderDto, ShowOrderResponse} from "../../../../frontend-client";
import {ActivatedRoute, Router} from "@angular/router";
import {map, Observable} from "rxjs";
import OrderStateEnum = ShowOrderDto.OrderStateEnum;

export interface ShowOrderViewState {
  canShowPlaceOrderButton: boolean
  isPlaceOrderButtonDisabled: boolean
  canShowMarkAsDeliveredButton: boolean
  shouldDisplayNewOrderEntryCard: boolean
  isOrderOwner: boolean,
  allEatingPeopleCount: number,
  numberOfCurrentUserEntries: number,
}

@Component({
  selector: 'app-show-order-view',
  templateUrl: './show-order-view.component.html',
  styleUrls: ['./show-order-view.component.scss']
})
export class ShowOrderViewComponent implements OnInit {

  orderResponse$: Observable<ShowOrderResponse>
  showOrderViewState$: Observable<ShowOrderViewState>

  constructor(private route: ActivatedRoute,
              private router: Router,
              private orderControllerService: OrderControllerService) {
    this.orderResponse$ = this.route.data.pipe(map(r => r['response']))

    this.showOrderViewState$ = this.createShowOrderViewStateObservable()
  }

  ngOnInit() {
  }

  shouldShowOrderLockedWarning() {
    return false;
  }

  private createShowOrderViewStateObservable() {
    return this.orderResponse$.pipe(
      map(r => {
        let order = r.order
        let orderState = r.order.orderState
        let orderEntries = r.orderEntries
        let currentUserId = r.currentUserId

        let isOrderOwner = order.orderCreatorId === currentUserId;
        let canShowPlaceOrderButton = isOrderOwner && [OrderStateEnum.CREATED, OrderStateEnum.ORDERING].includes(order.orderState)
        let canShowMarkAsDeliveredButton = isOrderOwner && orderState === OrderStateEnum.ORDERED;
        let isPlaceOrderButtonDisabled = orderEntries.length === 0;
        let allEatingPeopleCount = orderEntries.flatMap(e => e.dishEntries).length;
        let numberOfCurrentUserEntries = orderEntries.filter(e => e.userId === currentUserId).length;
        let shouldDisplayNewOrderEntryCard =  order.orderState == OrderStateEnum.CREATED && numberOfCurrentUserEntries === 0


        let obj: ShowOrderViewState = {
          canShowPlaceOrderButton: canShowPlaceOrderButton,
          isPlaceOrderButtonDisabled: isPlaceOrderButtonDisabled,
          canShowMarkAsDeliveredButton: canShowMarkAsDeliveredButton,
          shouldDisplayNewOrderEntryCard: shouldDisplayNewOrderEntryCard,
          isOrderOwner: isOrderOwner,
          allEatingPeopleCount: allEatingPeopleCount,
          numberOfCurrentUserEntries: numberOfCurrentUserEntries,
        }
        return obj
      })
    );
  }

  placeOrder() {

  }

  goToEditOrder() {

  }

  setAsDelivered() {

  }
}
