import {Component, Input, OnInit} from '@angular/core';
import {DishDto, OrderEntrySaveRequest, ShowOrderResponse} from "../../../../../../../../frontend-client";
import {ShowOrderViewService} from "../../../../service/show-order-view.service";
import {InitialOrderEntryFormValue, OrderEntryFormValue} from "../../lib/formvalues";

@Component({
  selector: 'app-create-order-entry',
  templateUrl: './create-order-entry.component.html',
  styleUrls: ['./create-order-entry.component.scss']
})
export class CreateOrderEntryComponent implements OnInit {

  @Input() dishIndex: number = 0;
  @Input() orderResponse!: ShowOrderResponse

  dishes!: DishDto[]

  initialValue: InitialOrderEntryFormValue = {
    dish: "",
    price: 0,
    additionalComments: "",
    chosenSideDishes: [],
  }


  constructor(private showOrderViewService: ShowOrderViewService) {
    this.showOrderViewService.setEntryLoading(true)
  }

  ngOnInit() {
    this.dishes = this.orderResponse.allDishesInRestaurant
    this.showOrderViewService.setEntryLoading(false)
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
      .subscribe()
  }

  onCancel() {
    this.showOrderViewService.cancelDishEntryModification()
  }
}
