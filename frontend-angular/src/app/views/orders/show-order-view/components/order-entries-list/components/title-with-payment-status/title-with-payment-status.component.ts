import {Component, input} from '@angular/core';
import {ParticipantsOrderEntry, ShowOrderDto} from "../../../../../../../../frontend-client";
import {OrderActionsService} from "../../../../service/order-actions.service";
import {PricePipe} from '../../../../../../../components/pipes/price.pipe';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonModule} from '@angular/material/button';
import {PaymentStatusChipComponent} from './payment-status-chip/payment-status-chip.component';

import OrderStateEnum = ShowOrderDto.OrderStateEnum;

@Component({
    selector: 'app-title-with-payment-status',
    templateUrl: './title-with-payment-status.component.html',
    styleUrls: ['./title-with-payment-status.component.scss'],
    standalone: true,
    imports: [PaymentStatusChipComponent, MatButtonModule, MatTooltipModule, MatIconModule, PricePipe]
})
export class TitleWithPaymentStatusComponent {
  readonly title = input.required<string>();
  readonly priceForUser = input.required<number>();
  readonly order = input.required<ShowOrderDto>();
  readonly orderEntry = input.required<ParticipantsOrderEntry>();
  readonly currentUserId = input.required<string>();
  readonly costForUser = input.required<number>();

  constructor(private orderActionsService: OrderActionsService) {
  }

  isOrderOwner() {
    return this.order().orderCreatorId === this.currentUserId();
  }

  isOrderEntryOwner() {
    return this.orderEntry().userId === this.currentUserId();
  }

  shouldShowPaymentStatus() {
    return (this.isOrderEntryOwner() || this.isOrderOwner()) && this.isOrderedOrDelivered()
  }

  shouldShowConfirmAsPaidButton() {
    return this.isOrderedOrDelivered()
      && this.orderEntry().paymentStatus !== ParticipantsOrderEntry.PaymentStatusEnum.Confirmed;
  }

  shouldShowRevertToUnpaid() {
    return this.isOrderedOrDelivered()
      && this.orderEntry().paymentStatus === ParticipantsOrderEntry.PaymentStatusEnum.Confirmed;
  }

  isConfirmedAsPaid() {
    return this.orderEntry().paymentStatus === ParticipantsOrderEntry.PaymentStatusEnum.Confirmed
  }

  private isOrderedOrDelivered() {
    return [OrderStateEnum.Ordered, OrderStateEnum.Delivered].includes(this.order().orderState);
  }

  confirmAsPaid(orderEntryId: string) {
    this.orderActionsService.confirmAsPaid(orderEntryId)
  }

  revertToUnpaid(orderEntryId: string) {
    this.orderActionsService.revertToUnpaid(orderEntryId)
  }
}
