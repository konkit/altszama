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

  formGroup = this.fb.nonNullable.group({
    name: "",
    price: 0,
    additionalComments: ""
  })

  constructor(private fb: FormBuilder,
              private showOrderViewService: ShowOrderViewService) {
    this.showOrderViewService.setEntryLoading(true)
  }

  ngOnInit() {
    // this.$store.commit("clearErrors");

    this.showOrderViewService.setEntryLoading(false)

    this.formGroup.setValue({
      name: this.dishEntry.dishName,
      price: this.dishEntry.price,
      additionalComments: this.dishEntry.comments
    })
  }

  submitForm() {
    // Set timeout is necessary to properly handle last-minute updates in form controls
    setTimeout(() => this.updateOrderEntry(), 0)
  }

  updateOrderEntry() {
    let orderEntryToUpdate: OrderEntryUpdateRequest
    orderEntryToUpdate = {
      id: this.orderEntry.id,
      orderId: this.orderResponse.order.id,
      dishId: "",
      dishEntryId: this.dishEntry.id,
      additionalComments: this.formGroup.controls.additionalComments.value,
      newDish: true,
      newDishName: this.formGroup.controls.name.value,
      newDishPrice: this.formGroup.controls.price.value,
      sideDishes: [],
    };

    // let orderEntryToUpdate

    // const dishData: (NewDishData | ExistingDishData) = state.orderEntryData.dishData
    // if (dishData.kind === "NewDishData") {
    //   orderEntryToUpdate = {
    //     orderId: orderId,
    //     dishId: "",
    //     dishEntryId: state.dishEntryId,
    //     additionalComments: state.orderEntryData.additionalComments,
    //     newDish: true,
    //     newDishName: dishData.newDishName,
    //     newDishPrice: dishData.newDishPrice,
    //     chosenSideDishes: dishData.chosenSideDishes
    //   };
    // } else {
    //   orderEntryToUpdate = {
    //     orderId: orderId,
    //     dishId: dishData.dishId,
    //     dishEntryId: state.dishEntryId,
    //     additionalComments: state.orderEntryData.additionalComments,
    //     newDish: false,
    //     newDishName: "",
    //     newDishPrice: 0,
    //     chosenSideDishes: dishData.chosenSideDishes
    //   };
    // }

    this.showOrderViewService.updateOrderEntry(orderEntryToUpdate)
      .subscribe({
        next: () => {},
        error: error => {
          this.formGroup.setErrors(error)
          return of("")
        }
      })
  }

  cancelEdit() {
    this.showOrderViewService.cancelDishEntryModification()
  }
}
