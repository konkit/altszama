import {Component, Input, OnInit} from '@angular/core';
import {DishDto, OrderEntrySaveRequest} from "../../../../../../../../frontend-client";
import {InitialOrderEntryFormValue, OrderEntryFormValue} from "../../lib/formvalues";
import {ModifyOrderEntryService} from "../../../../service/modify-order-entry.service";

@Component({
  selector: 'app-create-order-entry',
  templateUrl: './create-order-entry.component.html',
  styleUrls: ['./create-order-entry.component.scss']
})
export class CreateOrderEntryComponent implements OnInit {

  @Input() dishIndex: number = 0;
  @Input() orderId!: string;
  @Input() allDishesInRestaurant!: DishDto[]

  initialValue: InitialOrderEntryFormValue = {
    dish: "",
    price: 0,
    additionalComments: "",
    chosenSideDishes: [],
  }

  constructor(private modifyOrderEntryService: ModifyOrderEntryService) {
    this.modifyOrderEntryService.setEntryLoading(true)
  }

  ngOnInit() {
    this.modifyOrderEntryService.setEntryLoading(false)
  }

  onSubmit(orderEntry: OrderEntryFormValue) {
    let orderEntryToSave: OrderEntrySaveRequest
    if (orderEntry.kind === "Existing") {
      orderEntryToSave = {
        newDish: false,
        orderId: this.orderId,
        dishId: orderEntry.dish.id,
        additionalComments: orderEntry.additionalComments,
        newDishName: "",
        newDishPrice: 0,
        sideDishes: orderEntry.chosenSideDishes,
      };
    } else {
      orderEntryToSave = {
        newDish: true,
        orderId: this.orderId,
        dishId: "",
        additionalComments: orderEntry.additionalComments,
        newDishName: orderEntry.dishName,
        newDishPrice: orderEntry.price,
        sideDishes: orderEntry.chosenSideDishes,
      };
    }

    this.modifyOrderEntryService.doSaveOrderEntry(orderEntryToSave)
      .subscribe()
  }

  onCancel() {
    this.modifyOrderEntryService.cancelDishEntryModification()
  }
}
