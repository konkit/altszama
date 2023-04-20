import {Component, Input} from '@angular/core';
import {ShowOrderDto} from "../../../../../../frontend-client";
import {ShowOrderViewState} from "../../lib/model";

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent {

  @Input() order!: ShowOrderDto
  @Input() viewState!: ShowOrderViewState

}
