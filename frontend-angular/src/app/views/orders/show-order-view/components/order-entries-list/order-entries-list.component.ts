import {Component, Input} from '@angular/core';
import {ShowOrderResponse} from "../../../../../../frontend-client";
import {ModifyOrderEntryState, ShowOrderViewState} from "../../service/show-order-view.service";

@Component({
  selector: 'app-order-entries-list',
  templateUrl: './order-entries-list.component.html',
  styleUrls: ['./order-entries-list.component.scss']
})
export class OrderEntriesListComponent {

  @Input() showOrderResponse!: ShowOrderResponse
  @Input() viewState!: ShowOrderViewState
  @Input() modifyOrderEntryState!: ModifyOrderEntryState

  constructor() {
  }
}
