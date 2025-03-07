import {Component, Input, input} from '@angular/core';
import {DishDto, ParticipantsOrderEntry, ShowOrderDto} from "../../../../../../../../frontend-client";
import {ModifyOrderEntryState} from "../../../../../lib/model";
import {ModifyOrderEntryService} from "../../service/modify-order-entry.service";
import {CreateOrderEntryComponent} from '../create-order-entry/create-order-entry.component';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import {ShowOrderEntryComponent} from '../show-order-entry/show-order-entry.component';
import {EditOrderEntryComponent} from '../edit-order-entry/edit-order-entry.component';

import {TitleWithPaymentStatusComponent} from '../title-with-payment-status/title-with-payment-status.component';
import {MatCardModule} from '@angular/material/card';
import OrderStateEnum = ShowOrderDto.OrderStateEnum;

@Component({
    selector: 'app-existing-order-entry-card',
    templateUrl: './existing-order-entry-card.component.html',
    styleUrls: ['./existing-order-entry-card.component.scss'],
    standalone: true,
    imports: [MatCardModule, TitleWithPaymentStatusComponent, EditOrderEntryComponent, ShowOrderEntryComponent, MatDividerModule, MatButtonModule, MatIconModule, CreateOrderEntryComponent]
})
export class ExistingOrderEntryCardComponent {
  readonly order = input.required<ShowOrderDto>();
  readonly allDishesInRestaurant = input.required<DishDto[]>();
  readonly currentUserId = input.required<string>();
  @Input() orderEntry!: ParticipantsOrderEntry
  @Input() modifyOrderEntryState!: ModifyOrderEntryState

  constructor(private modifyOrderEntryService: ModifyOrderEntryService) {
  }

  createEntry() {
    this.modifyOrderEntryService.setDishEntryCreating()
  }

  canAddNewEntry(orderEntry: ParticipantsOrderEntry) {
    return this.order().orderState === OrderStateEnum.Created
      && orderEntry.userId === this.currentUserId()
      && !this.modifyOrderEntryState.isEntryEdited
  }

}
