import {Component, Input} from '@angular/core';
import {DishDto, ParticipantsOrderEntry, ShowOrderDto, ShowOrderResponse} from "../../../../../../frontend-client";
import {ModifyOrderEntryState} from "../../../lib/model";
import {Observable} from "rxjs";
import {ShowOrderViewService} from "../../service/show-order-view.service";
import {ModifyOrderEntryService} from "./service/modify-order-entry.service";
import {
  ExistingOrderEntryCardComponent
} from './components/existing-order-entry-card/existing-order-entry-card.component';
import {CreateOrderEntryComponent} from './components/create-order-entry/create-order-entry.component';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {AsyncPipe} from '@angular/common';
import OrderStateEnum = ShowOrderDto.OrderStateEnum;


@Component({
    selector: 'app-order-entries-list',
    templateUrl: './order-entries-list.component.html',
    styleUrls: ['./order-entries-list.component.scss'],
    standalone: true,
    imports: [MatCardModule, MatButtonModule, MatIconModule, CreateOrderEntryComponent, ExistingOrderEntryCardComponent, AsyncPipe]
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
