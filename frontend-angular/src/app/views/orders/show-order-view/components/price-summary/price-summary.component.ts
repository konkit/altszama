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
  @Input() priceSummaryInput!: PriceSummaryInput
}
