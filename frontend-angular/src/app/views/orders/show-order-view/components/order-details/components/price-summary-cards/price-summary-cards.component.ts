import {Component, Input} from '@angular/core';
import {PriceSummaryData} from "../../../../../lib/model";
import {PricePipe} from '../../../../../../../components/pipes/price.pipe';
import {NgClass} from '@angular/common';
import {MatListModule} from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';

@Component({
    selector: 'app-price-summary-cards',
    templateUrl: './price-summary-cards.component.html',
    styleUrl: './price-summary-cards.component.scss',
    standalone: true,
    imports: [
    MatCardModule,
    MatListModule,
    NgClass,
    PricePipe
],
})
export class PriceSummaryCardsComponent {
  @Input() priceSummaryData!: PriceSummaryData
}
