import {Component, computed, input} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {ShowOrderDto} from "../../../../../../frontend-client";
import {ShowOrderViewState} from "../../../lib/model";
import {PricePipe} from "../../../../../components/pipes/price.pipe";
import OrderStateEnum = ShowOrderDto.OrderStateEnum;

interface NextStepMessage {
  tone: 'primary' | 'success' | 'warning' | 'error'
  icon: string
  title: string
  text: string
}

@Component({
  selector: 'app-order-next-step',
  templateUrl: './order-next-step.component.html',
  styleUrls: ['./order-next-step.component.scss'],
  standalone: true,
  imports: [MatIconModule]
})
export class OrderNextStepComponent {
  readonly viewState = input.required<ShowOrderViewState>();

  private readonly pricePipe = new PricePipe()

  readonly message = computed<NextStepMessage | null>(() => {
    const vs = this.viewState()
    const order = vs.order
    const isOwner = vs.flags.isOrderOwner
    const creator = order.orderCreatorUsername
    const hasEntries = vs.yourOrderEntries.length > 0
    const yourPrice = this.pricePipe.transform(vs.yourTotalPrice)
    const atTimeOfOrder = order.timeOfOrder ? `at ${order.timeOfOrder}` : "soon"

    switch (order.orderState) {
      case OrderStateEnum.Created:
        if (isOwner) {
          return {
            tone: 'primary', icon: 'schedule', title: "Collecting orders",
            text: `You'll place the order ${atTimeOfOrder}. Click "Place order" once everyone has added their dishes.`
          }
        } else if (!hasEntries) {
          return {
            tone: 'primary', icon: 'restaurant_menu', title: "Add your dish",
            text: `${creator} will place the order ${atTimeOfOrder}. Add your dish before then.`
          }
        } else {
          return {
            tone: 'success', icon: 'check_circle', title: "You're in",
            text: `${creator} will place the order ${atTimeOfOrder}. You can change your dishes until then.`
          }
        }

      case OrderStateEnum.Ordering:
        // The order owner sees the "order locked" banner instead
        if (isOwner) {
          return null
        }
        return {
          tone: 'warning', icon: 'lock', title: "Order is being placed",
          text: `${creator} is calling the restaurant now, so the order is locked.`
        }

      case OrderStateEnum.Ordered: {
        const eta = order.timeOfDelivery ? `Expected delivery: ${order.timeOfDelivery}.` : "Delivery time not specified yet."
        const payHint = !isOwner && hasEntries && !vs.isYourPaymentConfirmed
          ? ` You can already pay ${yourPrice} to ${creator}.`
          : ""
        return {
          tone: 'primary', icon: 'delivery_dining', title: "Waiting for delivery",
          text: `Ordered ${atTimeOfOrder}. ${eta}${payHint}`
        }
      }

      case OrderStateEnum.Delivered:
        if (isOwner) {
          const allPaid = vs.paidEntriesCount === vs.entriesCount
          return {
            tone: allPaid ? 'success' : 'primary', icon: 'payments', title: allPaid ? "All settled" : "Collect payments",
            text: allPaid
              ? "Everyone has paid. Enjoy your meal!"
              : `${vs.paidEntriesCount} of ${vs.entriesCount} people have paid so far.`
          }
        } else if (hasEntries && !vs.isYourPaymentConfirmed) {
          return {
            tone: 'warning', icon: 'payments', title: `Pay ${yourPrice} to ${creator}`,
            text: `Payment options are listed in the summary. Once you've paid, click "I've paid" on your order.`
          }
        } else if (hasEntries) {
          return {
            tone: 'success', icon: 'check_circle', title: "All settled",
            text: "Your payment is confirmed. Enjoy your meal!"
          }
        } else {
          return {
            tone: 'success', icon: 'check_circle', title: "Delivered",
            text: `${creator}'s order has been delivered.`
          }
        }

      case OrderStateEnum.Rejected:
        return {
          tone: 'error', icon: 'block', title: "Order rejected",
          text: "This order was rejected and won't be delivered."
        }
    }

    return null
  })
}
