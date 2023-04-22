import {Component, Input} from '@angular/core';
import {DishDto, ParticipantsOrderEntry, ShowOrderDto} from "../../../../../../../../frontend-client";
import {ModifyOrderEntryState} from "../../../../lib/model";
import {ModifyOrderEntryService} from "../../service/modify-order-entry.service";
import OrderStateEnum = ShowOrderDto.OrderStateEnum;

@Component({
  selector: 'app-existing-order-entry-card',
  templateUrl: './existing-order-entry-card.component.html',
  styleUrls: ['./existing-order-entry-card.component.scss']
})
export class ExistingOrderEntryCardComponent {
  @Input() order!: ShowOrderDto
  @Input() allDishesInRestaurant!: DishDto[]
  @Input() currentUserId!: string;
  @Input() orderEntry!: ParticipantsOrderEntry
  @Input() modifyOrderEntryState!: ModifyOrderEntryState

  constructor(private modifyOrderEntryService: ModifyOrderEntryService) {
  }

  createEntry() {
    this.modifyOrderEntryService.setDishEntryCreating()
  }

  canAddNewEntry(orderEntry: ParticipantsOrderEntry) {
    return this.order.orderState === OrderStateEnum.CREATED
      && orderEntry.userId === this.currentUserId
      && !this.modifyOrderEntryState.isEntryEdited
  }

}
