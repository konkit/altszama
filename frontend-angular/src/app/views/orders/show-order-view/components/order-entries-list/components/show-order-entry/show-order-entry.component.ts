import {Component, Input} from '@angular/core';
import {ParticipantsDishEntry, ParticipantsOrderEntry, ShowOrderDto} from "../../../../../../../../frontend-client";
import OrderStateEnum = ShowOrderDto.OrderStateEnum;
import {faPencil, faTimes} from "@fortawesome/free-solid-svg-icons";
import {ShowOrderViewService} from "../../../../service/show-order-view.service";

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
    return this.isOrderOwner() || (this.isOrderEntryOwner() && this.order.orderState === OrderStateEnum.CREATED)
  }

  isOrderOwner() {
    return this.order.orderCreatorId === this.currentUserId;
  }

  isOrderEntryOwner() {
    return this.orderEntry.userId === this.currentUserId;
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
