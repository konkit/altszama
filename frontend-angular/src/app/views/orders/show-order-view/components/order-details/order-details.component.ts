import {Component, Input} from '@angular/core';
import {ShowOrderDto} from "../../../../../../frontend-client";
import {ShowOrderViewState} from "../../../lib/model";

import {PaymentOptionsSummaryComponent} from './components/payment-options-summary/payment-options-summary.component';
import {PriceSummaryComponent} from '../../../components/price-summary/price-summary.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {
  PaymentOptionsSummaryCardsComponent
} from './components/payment-options-summary-cards/payment-options-summary-cards.component';
import {PriceSummaryCardsComponent} from './components/price-summary-cards/price-summary-cards.component';
import {OrderDataSummaryComponent} from './components/order-data-summary/order-data-summary.component';
import {MatCardModule} from '@angular/material/card';

@Component({
    selector: 'app-order-details',
    templateUrl: './order-details.component.html',
    styleUrls: ['./order-details.component.scss'],
    standalone: true,
    imports: [MatCardModule, OrderDataSummaryComponent, PriceSummaryCardsComponent, PaymentOptionsSummaryCardsComponent, MatExpansionModule, PriceSummaryComponent, PaymentOptionsSummaryComponent]
})
export class OrderDetailsComponent {

  @Input() order!: ShowOrderDto
  @Input() viewState!: ShowOrderViewState

}
