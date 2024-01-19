import {Component, Input} from '@angular/core';
import {PriceSummaryData} from "../../../../../lib/model";

@Component({
  selector: 'app-price-summary-cards',
  templateUrl: './price-summary-cards.component.html',
  styleUrl: './price-summary-cards.component.scss',
})
export class PriceSummaryCardsComponent {
  @Input() priceSummaryData!: PriceSummaryData
}
