import {Component, Input} from '@angular/core';
import {ParticipantsDishEntry, ParticipantsOrderEntry, ShowOrderDto} from "../../../../../../../../frontend-client";
import {faPencil, faTimes} from "@fortawesome/free-solid-svg-icons";
import {ShowOrderViewService} from "../../../../service/show-order-view.service";
import OrderStateEnum = ShowOrderDto.OrderStateEnum;

@Component({
  selector: 'app-show-order-entry',
  templateUrl: './show-order-entry.component.html',
  styleUrls: ['./show-order-entry.component.scss']
})
export class ShowOrderEntryComponent {
  @Input() index!: number;
  @Input() order!: ShowOrderDto
  @Input() orderEntry!: ParticipantsOrderEntry;
  @Input() dishEntry!: ParticipantsDishEntry;
  @Input() currentUserId!: string;

  faPencil = faPencil;
  faTimes = faTimes;

  constructor(private showOrderViewService: ShowOrderViewService) {
  }

  canEditOrderEntry() {
    let isOrderOwner = this.order.orderCreatorId === this.currentUserId;
    let isOrderEntryOwner = this.orderEntry.userId === this.currentUserId;
    return isOrderOwner || (isOrderEntryOwner && this.order.orderState === OrderStateEnum.CREATED)
  }

  editDishEntry() {
    let params = {orderEntryId: this.orderEntry.id, dishEntryId: this.dishEntry.id};
    this.showOrderViewService.setDishEntryEditing(params)
  }

  deleteDishEntry() {
    let params = {orderEntryId: this.orderEntry.id, dishEntryId: this.dishEntry.id};
    this.showOrderViewService.deleteDishEntry(params).subscribe()
  }
}
