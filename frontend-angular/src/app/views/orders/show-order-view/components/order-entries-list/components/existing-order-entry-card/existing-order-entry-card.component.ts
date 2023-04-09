import {Component, Input} from '@angular/core';
import {ParticipantsOrderEntry, ShowOrderDto, ShowOrderResponse} from "../../../../../../../../frontend-client";
import {ShowOrderViewService,} from "../../../../service/show-order-view.service";
import {ModifyOrderEntryState, ShowOrderViewState} from "../../../../lib/model";
import OrderStateEnum = ShowOrderDto.OrderStateEnum;

@Component({
  selector: 'app-existing-order-entry-card',
  templateUrl: './existing-order-entry-card.component.html',
  styleUrls: ['./existing-order-entry-card.component.scss']
})
export class ExistingOrderEntryCardComponent {
  @Input() orderEntry!: ParticipantsOrderEntry
  @Input() showOrderResponse!: ShowOrderResponse
  @Input() viewState!: ShowOrderViewState
  @Input() modifyOrderEntryState!: ModifyOrderEntryState

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
