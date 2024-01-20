import {Component, Input} from '@angular/core';
import {ShowOrderDto} from "../../../../../../../../frontend-client";
import {NgIf} from '@angular/common';

@Component({
    selector: 'app-order-data-summary',
    templateUrl: './order-data-summary.component.html',
    styleUrls: ['./order-data-summary.component.scss'],
    standalone: true,
    imports: [NgIf]
})
export class OrderDataSummaryComponent {
  @Input() order!: ShowOrderDto

  protected readonly ShowOrderDto = ShowOrderDto;

  timeOfDeliveryOrNA() {
    if (this.order.timeOfDelivery != null) {
      return this.order.timeOfDelivery;
    } else {
      return "As ASAP as possible";
    }
  }
}
