import {Component, Input} from '@angular/core';
import {ParticipantsOrderEntry, ShowOrderDto} from "../../../../../../../../frontend-client";
import {OrderActionsService} from "../../../../service/order-actions.service";
import {PricePipe} from '../../../../../../../components/pipes/price.pipe';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonModule} from '@angular/material/button';
import {PaymentStatusChipComponent} from './payment-status-chip/payment-status-chip.component';
import {NgIf} from '@angular/common';
import OrderStateEnum = ShowOrderDto.OrderStateEnum;

@Component({
    selector: 'app-title-with-payment-status',
    templateUrl: './title-with-payment-status.component.html',
    styleUrls: ['./title-with-payment-status.component.scss'],
    standalone: true,
    imports: [NgIf, PaymentStatusChipComponent, MatButtonModule, MatTooltipModule, MatIconModule, PricePipe]
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
