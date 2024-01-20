import {Component, Input} from '@angular/core';
import {PriceSummaryData} from "../../lib/model";
import {PricePipe} from '../../../../components/pipes/price.pipe';
import {MatDividerModule} from '@angular/material/divider';

import {MatListModule} from '@angular/material/list';

@Component({
    selector: 'app-price-summary',
    templateUrl: './price-summary.component.html',
    styleUrls: ['./price-summary.component.scss'],
    standalone: true,
    imports: [MatListModule, MatDividerModule, PricePipe]
})
export class PriceSummaryComponent {
  @Input() priceSummaryData!: PriceSummaryData
}
