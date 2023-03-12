import {Component, EventEmitter, Input, Output} from '@angular/core';
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {ModifyOrderEntryState, ShowOrderViewService} from "../../../service/show-order-view.service";
import {ShowOrderResponse} from "../../../../../../../frontend-client";
import {ShowOrderViewState} from "../../../show-order-view.component";

@Component({
  selector: 'app-new-order-entry-card',
  templateUrl: './new-order-entry-card.component.html',
  styleUrls: ['./new-order-entry-card.component.scss']
})
export class NewOrderEntryCardComponent {

  @Input() showOrderResponse!: ShowOrderResponse
  @Input() modifyOrderEntryState!: ModifyOrderEntryState

  @Input() isEntryCreating!: boolean
  @Input() username!: string;

  @Output() refreshRequest = new EventEmitter<void>()

  faPlus = faPlus;

  constructor(private showOrderViewService: ShowOrderViewService) {
  }

  createEntry() {
    this.showOrderViewService.setDishEntryCreating()
  }

  onRefreshRequest() {
    this.refreshRequest.emit()
  }
}
