import {Component, Input} from '@angular/core';
import {ParticipantsOrderEntry, ShowOrderDto, ShowOrderResponse} from "../../../../../../../frontend-client";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {ModifyOrderEntryState, ShowOrderViewService} from "../../../service/show-order-view.service";
import {FormBuilder} from "@angular/forms";
import OrderStateEnum = ShowOrderDto.OrderStateEnum;

@Component({
  selector: 'app-order-entry-card',
  templateUrl: './order-entry-card.component.html',
  styleUrls: ['./order-entry-card.component.scss']
})
export class OrderEntryCardComponent {

  @Input() showOrderResponse!: ShowOrderResponse
  @Input() order!: ShowOrderDto;
  @Input() orderEntry!: ParticipantsOrderEntry;
  @Input() entryId!: number;
  @Input() currentUserId!: string;

  @Input() modifyOrderEntryState!: ModifyOrderEntryState

  faPlus = faPlus

  constructor(private showOrderViewService: ShowOrderViewService) {
  }
  createEntry() {
    this.showOrderViewService.setDishEntryCreating()
  }

  canAddNewEntry() {
    return this.order.orderState === OrderStateEnum.CREATED && this.orderEntry.userId === this.currentUserId && !this.modifyOrderEntryState.isEntryEdited
  }
}
