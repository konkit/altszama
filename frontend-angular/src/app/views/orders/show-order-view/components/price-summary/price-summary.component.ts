import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-price-summary',
  templateUrl: './price-summary.component.html',
  styleUrls: ['./price-summary.component.scss']
})
export class PriceSummaryComponent {
  @Input() orderDecreaseInPercent!: number;
  @Input() orderDeliveryCostPerEverybody!: number;
  @Input() basePriceSum!: number;
  @Input() orderDeliveryCostPerDish!: number;
  @Input() allEatingPeopleCount!: number;
  @Input() totalPrice!: number;
}
