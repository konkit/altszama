import {Component, Input} from '@angular/core';
import {ParticipantsOrderEntry, ShowOrderDto} from "../../../../../../../../frontend-client";
import {OrderActionsService} from "../../../../service/order-actions.service";
import OrderStateEnum = ShowOrderDto.OrderStateEnum;

@Component({
  selector: 'app-title-with-payment-status',
  templateUrl: './title-with-payment-status.component.html',
  styleUrls: ['./title-with-payment-status.component.scss']
})
export class TitleWithPaymentStatusComponent {
  @Input() index!: number;
  @Input() title!: string;
  @Input() priceForUser!: number;
  @Input() order!: ShowOrderDto;
  @Input() orderEntry!: ParticipantsOrderEntry;
  @Input() currentUserId!: string;
  @Input() costForUser!: number;

  constructor(private orderActionsService: OrderActionsService) {
  }

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

  isConfirmedAsPaid() {
    return this.orderEntry.paymentStatus === ParticipantsOrderEntry.PaymentStatusEnum.CONFIRMED
  }

  private isOrderedOrDelivered() {
    return [OrderStateEnum.ORDERED, OrderStateEnum.DELIVERED].includes(this.order.orderState);
  }

  confirmAsPaid(orderEntryId: string) {
    this.orderActionsService.confirmAsPaid(orderEntryId)
  }

  revertToUnpaid(orderEntryId: string) {
    this.orderActionsService.revertToUnpaid(orderEntryId)
  }
}
