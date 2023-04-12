import {Component, Input} from '@angular/core';
import {ParticipantsOrderEntry, ShowOrderDto, ShowOrderResponse} from "../../../../../../frontend-client";
import {ModifyOrderEntryState, ShowOrderViewState} from "../../lib/model";
import {ModifyOrderEntryService} from "../../service/modify-order-entry.service";
import OrderStateEnum = ShowOrderDto.OrderStateEnum;

@Component({
  selector: 'app-order-entries-list',
  templateUrl: './order-entries-list.component.html',
  styleUrls: ['./order-entries-list.component.scss']
})
export class OrderEntriesListComponent {

  @Input() showOrderResponse!: ShowOrderResponse
  @Input() otherUserOrderEntries!: Array<ParticipantsOrderEntry>
  @Input() viewState!: ShowOrderViewState
  @Input() modifyOrderEntryState!: ModifyOrderEntryState

  constructor(private modifyOrderEntryService: ModifyOrderEntryService) {
  }

  createEntry() {
    this.modifyOrderEntryService.setDishEntryCreating()
  }

  canAddNewEntry(orderEntry: ParticipantsOrderEntry) {
    return this.showOrderResponse.order.orderState === OrderStateEnum.CREATED
      && orderEntry.userId === this.showOrderResponse.currentUserId
      && !this.modifyOrderEntryState.isEntryEdited
  }
}
