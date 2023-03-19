import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ParticipantsOrderEntry, ShowOrderDto, ShowOrderResponse} from "../../../../../../frontend-client";
import {ShowOrderViewState} from "../../show-order-view.component";
import {ModifyOrderEntryState, ShowOrderViewService} from "../../service/show-order-view.service";
import {AuthService} from "../../../../../service/auth.service";
import OrderStateEnum = ShowOrderDto.OrderStateEnum;

@Component({
  selector: 'app-order-entries-list',
  templateUrl: './order-entries-list.component.html',
  styleUrls: ['./order-entries-list.component.scss']
})
export class OrderEntriesListComponent {

  @Input() showOrderResponse!: ShowOrderResponse
  @Input() viewState!: ShowOrderViewState
  @Input() modifyOrderEntryState!: ModifyOrderEntryState

  constructor() {
  }
}
