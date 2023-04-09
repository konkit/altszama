import {Component, Input, OnInit} from '@angular/core';
import {
  OrderEntryUpdateRequest,
  ParticipantsDishEntry,
  ParticipantsOrderEntry,
  ShowOrderResponse
} from "../../../../../../../../frontend-client";
import {ShowOrderViewService} from "../../../../service/show-order-view.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {InitialOrderEntryFormValue, OrderEntryFormValue} from "../../lib/formvalues";
import {ModifyOrderEntryState} from "../../../../lib/model";


@Component({
  selector: 'app-edit-order-entry',
  templateUrl: './edit-order-entry.component.html',
  styleUrls: ['./edit-order-entry.component.scss']
})
export class EditOrderEntryComponent implements OnInit {

  @Input() dishIndex!: number;
  @Input() orderResponse!: ShowOrderResponse
  @Input() modifyOrderEntryState!: ModifyOrderEntryState
  @Input() orderEntry!: ParticipantsOrderEntry
  @Input() dishEntry!: ParticipantsDishEntry

  initialValue!: InitialOrderEntryFormValue

  constructor(private showOrderViewService: ShowOrderViewService,
              private matSnackBar: MatSnackBar) {
    this.showOrderViewService.setEntryLoading(true)
  }

  ngOnInit() {
    this.initialValue = {
      dish: this.orderResponse.allDishesInRestaurant.find(x => x.id == this.dishEntry.dishId) || "",
      price: this.dishEntry.price,
      additionalComments: this.dishEntry.comments,
      chosenSideDishes: this.dishEntry.sideDishes,
    }
  }

  onSubmit(orderEntry: OrderEntryFormValue) {
    let orderEntryToUpdate: OrderEntryUpdateRequest
    if (orderEntry.kind === "Existing") {
      orderEntryToUpdate = {
        id: this.orderEntry.id,
        orderId: this.orderResponse.order.id,
        dishEntryId: this.dishEntry.id,
        newDish: false,
        dishId: orderEntry.dish.id,
        additionalComments: orderEntry.additionalComments,
        newDishName: "",
        newDishPrice: 0,
        sideDishes: orderEntry.chosenSideDishes,
      };
    } else {
      orderEntryToUpdate = {
        id: this.orderEntry.id,
        orderId: this.orderResponse.order.id,
        dishEntryId: this.dishEntry.id,
        newDish: true,
        dishId: "",
        additionalComments: orderEntry.additionalComments,
        newDishName: orderEntry.dishName,
        newDishPrice: orderEntry.price,
        sideDishes: orderEntry.chosenSideDishes,
      };
    }

    this.showOrderViewService.doUpdateOrderEntry(orderEntryToUpdate)
      .subscribe()
  }

  onCancel() {
    this.showOrderViewService.cancelDishEntryModification()
  }
}
