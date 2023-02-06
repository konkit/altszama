import {Component, Input} from '@angular/core';
import {ParticipantsOrderEntry, ShowOrderDto} from "../../../../../../../frontend-client";
import OrderStateEnum = ShowOrderDto.OrderStateEnum;
import {faUndo, faCheck} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-title-with-payment-status',
  templateUrl: './title-with-payment-status.component.html',
  styleUrls: ['./title-with-payment-status.component.scss']
})
export class TitleWithPaymentStatusComponent {
  @Input() title!: string;
  @Input() priceForUser!: number;
  @Input() order!: ShowOrderDto;
  @Input() orderEntry!: ParticipantsOrderEntry;
  @Input() currentUserId!: string;
  @Input() costForUser!: number;
  faUndo = faUndo;
  faCheck = faCheck;

  isOrderOwner() {
    return this.order.orderCreatorId === this.currentUserId;
  }

  isOrderEntryOwner() {
    return this.orderEntry.userId === this.currentUserId;
  }

  shouldShowPaymentStatus() {
    return (this.isOrderEntryOwner() || this.isOrderOwner()) && this.isOrderedOrDelivered()
  }

  shouldShowConfirmAsPaidButton() {
    return this.isOrderedOrDelivered()
      && this.orderEntry.paymentStatus !== ParticipantsOrderEntry.PaymentStatusEnum.CONFIRMED;
  }

  shouldShowRevertToUnpaid() {
    return this.isOrderedOrDelivered()
      && this.orderEntry.paymentStatus === ParticipantsOrderEntry.PaymentStatusEnum.CONFIRMED;
  }

  private isOrderedOrDelivered() {
    return [OrderStateEnum.ORDERED, OrderStateEnum.DELIVERED].includes(this.order.orderState);
  }

  confirmAsPaid(orderEntryId: string) {
    // this.ordersConnector
    //   .confirmOrderEntryAsPaid(orderEntryId)
    //   .then(() => {
    //     this.$store.commit("setLoadingTrue");
    //     this.$store.dispatch(`showOrder/fetchOrderDataAction`, this.$store.state.showOrder.order.id);
    //   })
    //   .catch(errResponse => ErrorHandler.handleError(errResponse));
  }

  revertToUnpaid(orderEntryId: string) {
    // this.ordersConnector
    //   .revertToUnpaid(orderEntryId)
    //   .then(() => {
    //     this.$store.commit("setLoadingTrue");
    //     this.$store.dispatch(`showOrder/fetchOrderDataAction`, this.$store.state.showOrder.order.id);
    //   })
    //   .catch(errResponse => ErrorHandler.handleError(errResponse));
  }

  isUnpaid() {
    return this.orderEntry.paymentStatus === ParticipantsOrderEntry.PaymentStatusEnum.UNPAID
  }

  isConfirmedAsPaid() {
    return this.orderEntry.paymentStatus === ParticipantsOrderEntry.PaymentStatusEnum.CONFIRMED
  }
}
