import {Component, Input} from '@angular/core';
import {DeliveryData, ShowOrderResponse} from "../../../../../../frontend-client";

export interface PriceSummaryInput {
  deliveryData: DeliveryData,
  basePriceSum: number,
  totalPrice: number,
  allEatingPeopleCount: number,
}

@Component({
  selector: 'app-price-summary',
  templateUrl: './price-summary.component.html',
  styleUrls: ['./price-summary.component.scss']
})
export class PriceSummaryComponent {
  // @Input() showOrderResponse!: ShowOrderResponse
  @Input() priceSummaryInput!: PriceSummaryInput

  // get deliveryData() {
  //   return this.showOrderResponse.order.deliveryData
  // }
  //
  // get basePriceSum() {
  //   return this.showOrderResponse.baseOrderPrice
  // }
  //
  // get totalPrice() {
  //   return this.showOrderResponse.totalOrderPrice
  // }
  //
  // get allEatingPeopleCount() {
  //   return this.showOrderResponse.orderEntries.flatMap(e => e.dishEntries).length;
  // }
}
