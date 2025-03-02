import {Component, Input, input} from '@angular/core';
import {ParticipantsDishEntry, ParticipantsOrderEntry, ShowOrderDto} from "../../../../../../../../frontend-client";
import {ModifyOrderEntryService} from "../../service/modify-order-entry.service";
import {PricePipe} from '../../../../../../../components/pipes/price.pipe';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';

import OrderStateEnum = ShowOrderDto.OrderStateEnum;

@Component({
    selector: 'app-show-order-entry',
    templateUrl: './show-order-entry.component.html',
    styleUrls: ['./show-order-entry.component.scss'],
    standalone: true,
    imports: [MatButtonModule, MatIconModule, PricePipe]
})
export class ShowOrderEntryComponent {
  readonly index = input.required<number>();
  readonly order = input.required<ShowOrderDto>();
  readonly orderEntry = input.required<ParticipantsOrderEntry>();
  @Input() dishEntry!: ParticipantsDishEntry;
  readonly currentUserId = input.required<string>();

  constructor(private modifyOrderEntryService: ModifyOrderEntryService) {
  }

  canEditOrderEntry() {
    let isOrderOwner = this.order().orderCreatorId === this.currentUserId();
    let isOrderEntryOwner = this.orderEntry().userId === this.currentUserId();
    return isOrderOwner || (isOrderEntryOwner && this.order().orderState === OrderStateEnum.Created)
  }

  editDishEntry() {
    let params = {orderEntryId: this.orderEntry().id, dishEntryId: this.dishEntry.id};
    this.modifyOrderEntryService.setDishEntryEditing(params)
  }

  deleteDishEntry() {
    let params = {orderEntryId: this.orderEntry().id, dishEntryId: this.dishEntry.id};
    this.modifyOrderEntryService.deleteDishEntry(params).subscribe()
  }
}
