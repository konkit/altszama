import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ParticipantsOrderEntry, ShowOrderDto, ShowOrderResponse} from "../../../../../../../frontend-client";
import OrderStateEnum = ShowOrderDto.OrderStateEnum;
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {ModifyOrderEntryState, ShowOrderViewService} from "../../../service/show-order-view.service";
import {Observable} from "rxjs";
import {FormBuilder} from "@angular/forms";

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


  formGroup = this.fb.group({
    name: "",
    price: 0,
    additionalComments: ""
  })
  @Output() refreshRequest = new EventEmitter<void>()

  constructor(private showOrderViewService: ShowOrderViewService,
              private fb: FormBuilder) {
  }

  isOrderEntryOwner() {
    return this.orderEntry.userId === this.currentUserId;
  }

  createEntry() {
    this.showOrderViewService.setDishEntryCreating()
  }

  get isEntryCreating() {
    return this.modifyOrderEntryState.isEntryCreating
  }

  get isEntryEdited() {
    return this.modifyOrderEntryState.isEntryEdited
  }

  get dishEntryId(): string {
    return this.modifyOrderEntryState.dishEntryId
  }

  canAddNewEntry() {
    return this.order.orderState === OrderStateEnum.CREATED && this.isOrderEntryOwner() && !this.isEntryEdited
  }

  onRefreshRequest() {
    console.log("order-entry-card.onRefreshRequest")
    this.refreshRequest.emit()
  }
}
