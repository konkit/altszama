import {Component, Input} from '@angular/core';
import {OrderEntryDto, ShowOrderDto} from "../../../../../../frontend-client";

@Component({
  selector: 'app-order-data-summary',
  templateUrl: './order-data-summary.component.html',
  styleUrls: ['./order-data-summary.component.scss']
})
export class OrderDataSummaryComponent {
  @Input() order!: ShowOrderDto

  timeOfDeliveryOrNA() {
    if (this.order.timeOfDelivery != null) {
      return this.order.timeOfDelivery;
    } else {
      return "As ASAP as possible";
    }
  }
}
