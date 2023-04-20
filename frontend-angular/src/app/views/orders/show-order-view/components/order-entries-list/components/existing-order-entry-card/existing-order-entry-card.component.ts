import {Component, Input} from '@angular/core';
import {ParticipantsOrderEntry, ShowOrderDto, ShowOrderResponse} from "../../../../../../../../frontend-client";
import {ModifyOrderEntryState} from "../../../../lib/model";
import {ModifyOrderEntryService} from "../../../../service/modify-order-entry.service";
import OrderStateEnum = ShowOrderDto.OrderStateEnum;

@Component({
  selector: 'app-existing-order-entry-card',
  templateUrl: './existing-order-entry-card.component.html',
  styleUrls: ['./existing-order-entry-card.component.scss']
})
export class ExistingOrderEntryCardComponent {
  @Input() orderEntry!: ParticipantsOrderEntry
  @Input() showOrderResponse!: ShowOrderResponse
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
