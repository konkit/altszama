import {Component, Input, OnInit} from '@angular/core';
import {
  OrderEntryUpdateRequest,
  ParticipantsDishEntry,
  ParticipantsOrderEntry,
  ShowOrderResponse
} from "../../../../../../../../frontend-client";
import {ModifyOrderEntryState, ShowOrderViewService} from "../../../../service/show-order-view.service";
import {FormBuilder} from "@angular/forms";
import {of} from "rxjs";
import {InitialOrderEntryFormValue, OrderEntryFormValue} from "../order-entry-form/order-entry-form.component";


@Component({
  selector: 'app-edit-order-entry',
  templateUrl: './edit-order-entry.component.html',
  styleUrls: ['./edit-order-entry.component.scss']
})
export class EditOrderEntryComponent implements OnInit {

  @Input() orderResponse!: ShowOrderResponse
  @Input() modifyOrderEntryState!: ModifyOrderEntryState
  @Input() orderEntry!: ParticipantsOrderEntry
  @Input() dishEntry!: ParticipantsDishEntry

  initialValue!: InitialOrderEntryFormValue

  constructor(private fb: FormBuilder,
              private showOrderViewService: ShowOrderViewService) {
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
    //TODO(konkit): Refactor

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
      .subscribe({
        next: () => {
        },
        error: error => {
          // this.formGroup.setErrors(error) TODO - set an error somewhere
          return of("")
        }
      })
  }

  onCancel() {
    this.showOrderViewService.cancelDishEntryModification()
  }
}
