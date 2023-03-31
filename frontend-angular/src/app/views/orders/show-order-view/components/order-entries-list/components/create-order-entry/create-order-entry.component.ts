import {Component, Input, OnInit} from '@angular/core';
import {of} from "rxjs";
import {DishDto, OrderEntrySaveRequest, ShowOrderResponse} from "../../../../../../../../frontend-client";
import {ShowOrderViewService} from "../../../../service/show-order-view.service";
import {FormBuilder} from "@angular/forms";
import {InitialOrderEntryFormValue, OrderEntryFormValue} from "../order-entry-form/order-entry-form.component";

@Component({
  selector: 'app-create-order-entry',
  templateUrl: './create-order-entry.component.html',
  styleUrls: ['./create-order-entry.component.scss']
})
export class CreateOrderEntryComponent implements OnInit {

  @Input() orderResponse!: ShowOrderResponse

  dishes!: DishDto[]

  initialValue!: InitialOrderEntryFormValue


  constructor(private showOrderViewService: ShowOrderViewService,
              private fb: FormBuilder) {
    this.showOrderViewService.setEntryLoading(true)
  }

  ngOnInit() {
    this.dishes = this.orderResponse.allDishesInRestaurant
    this.showOrderViewService.setEntryLoading(false)

    this.initialValue = {
      dish: "",
      price: 0,
      additionalComments: "",
      chosenSideDishes: [],
    }
  }

  onSubmit(orderEntry: OrderEntryFormValue) {
    let orderEntryToSave: OrderEntrySaveRequest
    if (orderEntry.kind === "Existing") {
      orderEntryToSave = {
        newDish: false,
        orderId: this.orderResponse.order.id,
        dishId: orderEntry.dish.id,
        additionalComments: orderEntry.additionalComments,
        newDishName: "",
        newDishPrice: 0,
        sideDishes: orderEntry.chosenSideDishes,
      };
    } else {
      orderEntryToSave = {
        newDish: true,
        orderId: this.orderResponse.order.id,
        dishId: "",
        additionalComments: orderEntry.additionalComments,
        newDishName: orderEntry.dishName,
        newDishPrice: orderEntry.price,
        sideDishes: orderEntry.chosenSideDishes,
      };
    }

    this.showOrderViewService.doSaveOrderEntry(orderEntryToSave)
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
