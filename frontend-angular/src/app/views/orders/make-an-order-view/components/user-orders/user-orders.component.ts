import {Component, Input} from '@angular/core';
import {GroupedOrderEntry} from "../../../../../../frontend-client";

@Component({
  selector: 'app-user-orders',
  templateUrl: './user-orders.component.html',
  styleUrls: ['./user-orders.component.scss']
})
export class UserOrdersComponent {
  @Input() groupedEntries!: GroupedOrderEntry[]
}
