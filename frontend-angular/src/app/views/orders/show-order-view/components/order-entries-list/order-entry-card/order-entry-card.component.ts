import {Component, Input} from '@angular/core';
import {ParticipantsOrderEntry, ShowOrderDto} from "../../../../../../../frontend-client";
import {OrderEntryService} from "../../../../../../service/order-entry.service";
import OrderStateEnum = ShowOrderDto.OrderStateEnum;
import {faPlus} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-order-entry-card',
  templateUrl: './order-entry-card.component.html',
  styleUrls: ['./order-entry-card.component.scss']
})
export class OrderEntryCardComponent {
  @Input() order!: ShowOrderDto;
  @Input() orderEntry!: ParticipantsOrderEntry;
  @Input() entryId!: number;
  @Input() currentUserId!: string;

  faPlus = faPlus

  constructor(private orderEntryService: OrderEntryService) {
  }

  isOrderEntryOwner() {
    return this.orderEntry.userId === this.currentUserId;
  }

  createEntry() {
    this.orderEntryService.setDishEntryCreating()
  }

  get isEntryCreating() {
    return this.orderEntryService.isModifiedEntryCreating()
  }

  get isEntryEdited() {
    return this.orderEntryService.isModifiedEntryEdited()
  }

  get dishEntryId(): string {
    return this.orderEntryService.getModifiedDishEntryId();
  }

  canAddNewEntry() {
    return this.order.orderState === OrderStateEnum.CREATED && this.isOrderEntryOwner() && !this.isEntryEdited
  }
}
