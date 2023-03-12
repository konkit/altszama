import {Component, Input} from '@angular/core';
import {ParticipantsOrderEntry, ShowOrderDto, ShowOrderResponse} from "../../../../../../frontend-client";
import OrderStateEnum = ShowOrderDto.OrderStateEnum;
import {ShowOrderViewState} from "../../show-order-view.component";

@Component({
  selector: 'app-order-entries-list',
  templateUrl: './order-entries-list.component.html',
  styleUrls: ['./order-entries-list.component.scss']
})
export class OrderEntriesListComponent {

  @Input() showOrderResponse!: ShowOrderResponse
  @Input() viewState!: ShowOrderViewState

  // isOrderOwner(): boolean {
  //   return this.showOrderResponse.order.orderCreatorId === this.currentUserId;
  // }

  // placeOrder() {
  //   this.router.navigate(["/make_an_order/", this.showOrderResponse.order.id])
  // }

  // setAsDelivered() {
  //   this.$store.commit("setLoadingTrue");
  //   this.ordersConnector
  //     .setOrderAsDelivered(this.orderId)
  //     .then(() => {
  //       this.$store.dispatch(`showOrder/fetchOrderDataAction`, this.showOrderResponse.order.id);
  //     })
  //     .catch(errResponse => {
  //       this.$store.commit("setLoadingFalse");
  //       ErrorHandler.handleError(errResponse)
  //     });
  // }

  goToEditOrder() {
    // this.router.navigate({name: "OrderEditForm", params: {id: this.orderId}});
  }

  canShowPlaceOrderButton(): boolean {
    return this.viewState.isOrderOwner && [OrderStateEnum.CREATED, OrderStateEnum.ORDERING].includes(this.showOrderResponse.order.orderState);
  }

  canShowMarkAsDeliveredButton(): boolean {
    return this.viewState.isOrderOwner && this.showOrderResponse.order.orderState === OrderStateEnum.ORDERED;
  }

  isPlaceOrderButtonDisabled(): boolean {
    return this.orderEntries.length === 0;
  }

  allEatingPeopleCount(): number {
    return this.orderEntries.flatMap(e => e.dishEntries).length;
  }

  // private handleOrderChangeSSE() {
  //   this.es = new EventSourcePolyfill('/api/orders/sse', {headers: {Authorization: "Bearer " + this.$store.state.token}});
  //
  //   // const controlListener = function (event: any) {
  //   //   const type = event.type;
  //   //   console.log(type + ": " + (type === "message" ? event.data : es.url))
  //   // };
  //
  //   const eventListener = (event: any) => {
  //     const data = JSON.parse(event.data)
  //     if (data.orderId === this.orderId) {
  //       this.$store.dispatch(`showOrder/fetchOrderDataAction`, this.orderId);
  //     }
  //   };
  //
  //   // es.addEventListener("open", controlListener);
  //   this.es.addEventListener("message", eventListener);
  //   // es.addEventListener("error", controlListener);
  // }

  get numberOfCurrentUserEntries(): number {
    return this.orderEntries.filter(e => e.userId === this.currentUserId)
      .length;
  }

  // get orderState(): OrderStateEnum {
  //   // const showOrder: ShowOrderState = this.$store.state.showOrder;
  //   return this.order.orderState;
  // }
  //
  // get order(): ShowOrderDto {
  //   // const showOrder: ShowOrderState = this.$store.state.showOrder;
  //   return showOrder.order;
  // }

  get orderEntries(): ParticipantsOrderEntry[] {
    // const showOrder: ShowOrderState = this.$store.state.showOrder;
    return this.showOrderResponse.orderEntries;
  }

  get yourOrderEntries(): ParticipantsOrderEntry[] {
    // const showOrder: ShowOrderState = this.$store.state.showOrder;
    return this.showOrderResponse.orderEntries.filter(e => e.userId === this.currentUserId);
  }

  get otherUsersOrderEntries(): ParticipantsOrderEntry[] {
    // const showOrder: ShowOrderState = this.$store.state.showOrder;
    return this.showOrderResponse.orderEntries.filter(e => e.userId !== this.currentUserId);
  }

  get currentUserId(): string {
    // const showOrder: ShowOrderState = this.$store.state.showOrder;
    return this.showOrderResponse.currentUserId;
  }

  get totalOrderPrice(): number {
    // const showOrder: ShowOrderState = this.$store.state.showOrder;
    return this.showOrderResponse.totalOrderPrice;
  }

  get baseOrderPrice(): number {
    // const showOrder: ShowOrderState = this.$store.state.showOrder;
    return this.showOrderResponse.baseOrderPrice;
  }

  get isEntryCreating(): boolean {
    return true
    // return this.$store.state.modifyOrderEntry.isEntryCreating;
  }

  get username(): string {
    return ""
    // return this.$store.state.username;
  }

  shouldDisplayNewOrderEntryCard(): boolean {
    return true
    // return this.order.orderState == OrderStateEnum.CREATED && this.numberOfCurrentUserEntries === 0
  }
}
