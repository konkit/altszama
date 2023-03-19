import {Component, OnInit} from '@angular/core';
import {
  OrderControllerService,
  ParticipantsOrderEntry,
  ShowOrderDto,
  ShowOrderResponse
} from "../../../../frontend-client";
import {ActivatedRoute, Router} from "@angular/router";
import {map, Observable, take} from "rxjs";
import OrderStateEnum = ShowOrderDto.OrderStateEnum;
import {ModifyOrderEntryState, ShowOrderViewService} from "./service/show-order-view.service";
import {AuthService} from "../../../service/auth.service";
import {PriceSummaryInput} from "./components/price-summary/price-summary.component";

export interface ShowOrderViewState {
  canShowPlaceOrderButton: boolean
  isPlaceOrderButtonDisabled: boolean
  canShowMarkAsDeliveredButton: boolean
  shouldDisplayNewOrderEntryCard: boolean
  isOrderOwner: boolean,
  allEatingPeopleCount: number,
  numberOfCurrentUserEntries: number,
  username: string,
  yourOrderEntries: ParticipantsOrderEntry[],
  otherUsersOrderEntries: ParticipantsOrderEntry[],
  priceSummaryInput: PriceSummaryInput;
}

@Component({
  selector: 'app-show-order-view',
  templateUrl: './show-order-view.component.html',
  styleUrls: ['./show-order-view.component.scss']
})
export class ShowOrderViewComponent implements OnInit {

  orderResponse$: Observable<ShowOrderResponse>
  showOrderViewState$: Observable<ShowOrderViewState>
  modifyOrderEntryState$: Observable<ModifyOrderEntryState>;


  constructor(private route: ActivatedRoute,
              private router: Router,
              private orderControllerService: OrderControllerService,
              private showOrderViewService: ShowOrderViewService,
              private authService: AuthService) {
    this.orderResponse$ = this.showOrderViewService.orderResponseAsObservable()
    this.showOrderViewState$ = this.createShowOrderViewStateObservable()
    this.modifyOrderEntryState$ = this.showOrderViewService.modifyOrderEntryStateAsObservable()
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

        let username = this.authService.getLoggedUser()!.username;
        let yourOrderEntries = orderEntries.filter(e => e.userId === currentUserId);
        let otherUsersOrderEntries = orderEntries.filter(e => e.userId !== currentUserId);
        let priceSummaryInput: PriceSummaryInput = {
          deliveryData: r.order.deliveryData,
          basePriceSum: r.baseOrderPrice,
          totalPrice: r.totalOrderPrice,
          allEatingPeopleCount: r.orderEntries.flatMap(e => e.dishEntries).length,
        }


        let obj: ShowOrderViewState = {
          canShowPlaceOrderButton: canShowPlaceOrderButton,
          isPlaceOrderButtonDisabled: isPlaceOrderButtonDisabled,
          canShowMarkAsDeliveredButton: canShowMarkAsDeliveredButton,
          shouldDisplayNewOrderEntryCard: shouldDisplayNewOrderEntryCard,
          isOrderOwner: isOrderOwner,
          allEatingPeopleCount: allEatingPeopleCount,
          numberOfCurrentUserEntries: numberOfCurrentUserEntries,
          username: username,
          yourOrderEntries: yourOrderEntries,
          otherUsersOrderEntries: otherUsersOrderEntries,
          priceSummaryInput: priceSummaryInput,
        }
        return obj
      })
    );
  }

  placeOrder() {
    this.router.navigate(["/orders", this.getOrderId(), "make_an_order"])
  }

  goToEditOrder() {
    console.error("goToEditOrder not implemented yet!")
  }

  setAsDelivered() {
    this.orderControllerService.setAsDelivered(this.getOrderId())
      .subscribe({
        next: () => this.showOrderViewService.reloadOrderResponse(),
      })
  }

  getOrderId() {
    return this.route.snapshot.paramMap.get('id')!
  }
}
