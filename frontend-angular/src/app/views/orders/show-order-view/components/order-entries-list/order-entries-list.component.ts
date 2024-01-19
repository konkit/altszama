import {Component, Input} from '@angular/core';
import {DishDto, ParticipantsOrderEntry, ShowOrderDto, ShowOrderResponse} from "../../../../../../frontend-client";
import {ModifyOrderEntryState} from "../../../lib/model";
import {Observable} from "rxjs";
import {ShowOrderViewService} from "../../service/show-order-view.service";
import {ModifyOrderEntryService} from "./service/modify-order-entry.service";
import OrderStateEnum = ShowOrderDto.OrderStateEnum;


@Component({
  selector: 'app-order-entries-list',
  templateUrl: './order-entries-list.component.html',
  styleUrls: ['./order-entries-list.component.scss']
})
export class OrderEntriesListComponent {

  @Input() username!: string;
  @Input() allDishesInRestaurant!: DishDto[]
  @Input() order!: ShowOrderDto
  @Input() currentUserId!: string;
  @Input() showOrderResponse!: ShowOrderResponse
  @Input() yourOrderEntries!: Array<ParticipantsOrderEntry>

  otherUserOrderEntries$: Observable<Array<ParticipantsOrderEntry>>
  modifyOrderEntryState$: Observable<ModifyOrderEntryState>;

  constructor(private modifyOrderEntryService: ModifyOrderEntryService,
              private showOrderViewService: ShowOrderViewService) {
    this.otherUserOrderEntries$ = this.showOrderViewService.otherUserOrderEntriesAsObservable()
    this.modifyOrderEntryState$ = this.modifyOrderEntryService.modifyOrderEntryStateAsObservable()
  }

  createEntry() {
    this.modifyOrderEntryService.setDishEntryCreating()
  }

  protected readonly ShowOrderDto = ShowOrderDto;
  protected readonly OrderStateEnum = OrderStateEnum;
}
