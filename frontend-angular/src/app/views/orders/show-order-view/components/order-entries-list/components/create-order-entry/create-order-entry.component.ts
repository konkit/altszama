import {Component, Input, OnInit} from '@angular/core';
import {of} from "rxjs";
import {
  OrderEntryControllerService,
  OrderEntrySaveRequest,
  ShowOrderResponse
} from "../../../../../../../../frontend-client";
import {ModifyOrderEntryState, ShowOrderViewService} from "../../../../service/show-order-view.service";
import {FormBuilder} from "@angular/forms";

@Component({
  selector: 'app-create-order-entry',
  templateUrl: './create-order-entry.component.html',
  styleUrls: ['./create-order-entry.component.scss']
})
export class CreateOrderEntryComponent implements OnInit {

  @Input() orderResponse!: ShowOrderResponse
  @Input() modifyOrderEntryState!: ModifyOrderEntryState

  formGroup = this.fb.nonNullable.group({
    name: "",
    price: 0,
    additionalComments: ""
  })

  constructor(private showOrderViewService: ShowOrderViewService,
              private orderEntryControllerService: OrderEntryControllerService,
              private fb: FormBuilder) {
    this.showOrderViewService.setEntryLoading(true)
  }

  ngOnInit() {
    // this.$store.commit("clearErrors");

    const orderId = this.orderResponse.order.id;

    let dishId;
    if (this.orderResponse.allDishesInRestaurant.length > 0) {
      dishId = this.orderResponse.allDishesInRestaurant[0].id;
    } else {
      dishId = null;
    }

    this.showOrderViewService.setEntryLoading(false)
  }

  submitForm() {
    // Set timeout is necessary to properly handle last-minute updates in form controls
    setTimeout(() => this.saveOrderEntry(), 0)
  }

  private saveOrderEntry() {
    let orderEntryToSave: OrderEntrySaveRequest
    orderEntryToSave = {
      orderId: this.orderResponse.order.id,
      dishId: "",
      additionalComments: this.formGroup.controls.additionalComments.value,
      newDish: true,
      newDishName: this.formGroup.controls.name.value,
      newDishPrice: this.formGroup.controls.price.value,
      sideDishes: [],
    };

    // TODO(konkit): add autosuggest
    // TODO(konkit): add detecting already selected dish, thus deduplicating

    this.showOrderViewService.saveOrderEntry(orderEntryToSave)
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
