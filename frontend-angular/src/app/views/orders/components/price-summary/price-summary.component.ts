import {Component, Input} from '@angular/core';
import {PriceSummaryData} from "../../lib/model";
import {PricePipe} from '../../../../components/pipes/price.pipe';


@Component({
    selector: 'app-price-summary',
    templateUrl: './price-summary.component.html',
    styleUrls: ['./price-summary.component.scss'],
    standalone: true,
    imports: [PricePipe]
})
export class PriceSummaryComponent {
  @Input() priceSummaryData!: PriceSummaryData
}
