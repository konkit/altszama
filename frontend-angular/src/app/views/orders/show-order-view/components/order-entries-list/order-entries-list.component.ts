import {Component, computed, input, ChangeDetectionStrategy} from '@angular/core';
import {DishDto, ParticipantsOrderEntry, ShowOrderDto} from "../../../../../../frontend-client";
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
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatCardModule, MatButtonModule, MatIconModule, CreateOrderEntryComponent, ExistingOrderEntryCardComponent, AsyncPipe]
})
export class OrderEntriesListComponent {

  readonly username = input.required<string>();
  readonly allDishesInRestaurant = input.required<DishDto[]>();
  readonly order = input.required<ShowOrderDto>();
  readonly currentUserId = input.required<string>();
  readonly yourOrderEntries = input.required<Array<ParticipantsOrderEntry>>();

  readonly canAddYourEntry = computed(() => this.order().orderState === OrderStateEnum.Created && this.yourOrderEntries().length === 0)
  readonly showYourSection = computed(() => this.canAddYourEntry() || this.yourOrderEntries().length > 0)

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
