import {Component, input, OnInit} from '@angular/core';
import {
  DishDto,
  OrderEntryUpdateRequest,
  ParticipantsDishEntry,
  ParticipantsOrderEntry
} from "../../../../../../../../frontend-client";
import {InitialOrderEntryFormValue, OrderEntryFormValue} from "../../lib/formvalues";
import {ModifyOrderEntryState} from "../../../../../lib/model";
import {ModifyOrderEntryService} from "../../service/modify-order-entry.service";
import {OrderEntryFormComponent} from '../order-entry-form/order-entry-form.component';


@Component({
    selector: 'app-edit-order-entry',
    templateUrl: './edit-order-entry.component.html',
    styleUrls: ['./edit-order-entry.component.scss'],
    standalone: true,
    imports: [OrderEntryFormComponent]
})
export class EditOrderEntryComponent implements OnInit {

  readonly dishIndex = input.required<number>();
  readonly modifyOrderEntryState = input.required<ModifyOrderEntryState>();
  readonly allDishesInRestaurant = input.required<DishDto[]>();
  readonly orderId = input.required<string>();
  readonly orderEntry = input.required<ParticipantsOrderEntry>();
  readonly dishEntry = input.required<ParticipantsDishEntry>();

  initialValue!: InitialOrderEntryFormValue

  constructor(private modifyOrderEntryService: ModifyOrderEntryService) {
  }

  ngOnInit() {
    this.initialValue = {
      dish: this.allDishesInRestaurant().find(x => x.id == this.dishEntry().dishId) || this.dishEntry().dishName,
      price: this.dishEntry().price,
      additionalComments: this.dishEntry().comments,
      chosenSideDishes: this.dishEntry().sideDishes,
    }
  }

  onSubmit(orderEntry: OrderEntryFormValue) {
    let orderEntryToUpdate: OrderEntryUpdateRequest
    if (orderEntry.kind === "Existing") {
      orderEntryToUpdate = {
        id: this.orderEntry().id,
        orderId: this.orderId(),
        dishEntryId: this.dishEntry().id,
        newDish: false,
        dishId: orderEntry.dish.id,
        additionalComments: orderEntry.additionalComments,
        newDishName: "",
        newDishPrice: 0,
        sideDishes: orderEntry.chosenSideDishes,
      };
    } else {
      orderEntryToUpdate = {
        id: this.orderEntry().id,
        orderId: this.orderId(),
        dishEntryId: this.dishEntry().id,
        newDish: true,
        dishId: "",
        additionalComments: orderEntry.additionalComments,
        newDishName: orderEntry.dishName,
        newDishPrice: orderEntry.price,
        sideDishes: orderEntry.chosenSideDishes,
      };
    }

    this.modifyOrderEntryService.doUpdateOrderEntry(orderEntryToUpdate)
      .subscribe()
  }

  onCancel() {
    this.modifyOrderEntryService.cancelDishEntryModification()
  }
}
