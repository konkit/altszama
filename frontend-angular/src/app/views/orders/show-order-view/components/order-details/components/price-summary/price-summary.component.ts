import {Component, Input} from '@angular/core';
import {PriceSummaryData} from "../../../../lib/model";

@Component({
  selector: 'app-price-summary',
  templateUrl: './price-summary.component.html',
  styleUrls: ['./price-summary.component.scss']
})
export class PriceSummaryComponent {
  @Input() priceSummaryData!: PriceSummaryData
}
