import {Component, Input} from '@angular/core';
import {ParticipantsOrderEntry, ShowOrderDto, ShowOrderResponse} from "../../../../../../frontend-client";
import {ModifyOrderEntryState, ShowOrderViewService, ShowOrderViewState} from "../../service/show-order-view.service";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import OrderStateEnum = ShowOrderDto.OrderStateEnum;

@Component({
  selector: 'app-order-entries-list',
  templateUrl: './order-entries-list.component.html',
  styleUrls: ['./order-entries-list.component.scss']
})
export class OrderEntriesListComponent {

  @Input() showOrderResponse!: ShowOrderResponse
  @Input() viewState!: ShowOrderViewState
  @Input() modifyOrderEntryState!: ModifyOrderEntryState

  faPlus = faPlus;

  constructor(private showOrderViewService: ShowOrderViewService) {
  }

  createEntry() {
    this.showOrderViewService.setDishEntryCreating()
  }

  canAddNewEntry(orderEntry: ParticipantsOrderEntry) {
    return this.showOrderResponse.order.orderState === OrderStateEnum.CREATED
      && orderEntry.userId === this.showOrderResponse.currentUserId
      && !this.modifyOrderEntryState.isEntryEdited
  }
}
