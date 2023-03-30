import {Component, Input, OnInit} from '@angular/core';
import {of} from "rxjs";
import {DishDto, OrderEntrySaveRequest, ShowOrderResponse} from "../../../../../../../../frontend-client";
import {ShowOrderViewService} from "../../../../service/show-order-view.service";
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {OrderEntryFormType, SideDishForm} from "../order-entry-form/order-entry-form.component";

@Component({
  selector: 'app-create-order-entry',
  templateUrl: './create-order-entry.component.html',
  styleUrls: ['./create-order-entry.component.scss']
})
export class CreateOrderEntryComponent implements OnInit {

  @Input() orderResponse!: ShowOrderResponse

  dishes!: DishDto[]

  formGroup: FormGroup<OrderEntryFormType> = this.fb.nonNullable.group({
    dish: this.fb.nonNullable.control<DishDto | string>(''),
    price: this.fb.nonNullable.control<number>(0),
    additionalComments: this.fb.nonNullable.control<string>(''),
    chosenSideDishes: this.fb.nonNullable.array<FormGroup<SideDishForm>>([])
  });

  constructor(private showOrderViewService: ShowOrderViewService,
              private fb: FormBuilder) {
    this.showOrderViewService.setEntryLoading(true)
  }

  ngOnInit() {
    this.dishes = this.orderResponse.allDishesInRestaurant
    this.showOrderViewService.setEntryLoading(false)
  }

  private saveOrderEntry() {
    let orderEntryToSave: OrderEntrySaveRequest
    if (typeof this.formGroup.controls.dish.value === "object") {
      orderEntryToSave = {
        newDish: false,
        orderId: this.orderResponse.order.id,
        dishId: this.formGroup.controls.dish.value.id,
        additionalComments: this.formGroup.controls.additionalComments.value,
        newDishName: "",
        newDishPrice: 0,
        sideDishes: this.asSideDishArray(this.formGroup.controls.chosenSideDishes),
      };
    } else {
      orderEntryToSave = {
        newDish: true,
        orderId: this.orderResponse.order.id,
        dishId: "",
        additionalComments: this.formGroup.controls.additionalComments.value,
        newDishName: this.formGroup.controls.dish.value,
        newDishPrice: this.formGroup.controls.price.value,
        sideDishes: this.asSideDishArray(this.formGroup.controls.chosenSideDishes),
      };
    }

    this.showOrderViewService.doSaveOrderEntry(orderEntryToSave)
      .subscribe({
        next: () => {},
        error: error => {
          this.formGroup.setErrors(error)
          return of("")
        }
      })
  }

  private asSideDishArray(formArray: FormArray<FormGroup<SideDishForm>>) {
    return formArray.value.map(formValue => {
      if (typeof formValue.sideDish === "object") {
        if (formValue.sideDish.price === formValue.price) {
          return {
            id: formValue.sideDish.id,
            isNew: false,
            newSideDishName: "",
            newSideDishPrice: 0
          }
        } else {
          return {
            id: "",
            isNew: true,
            newSideDishName: formValue.sideDish.name,
            newSideDishPrice: formValue.price
          }
        }
      } else {
        return {
          id: "",
          isNew: true,
          newSideDishName: formValue.sideDish,
          newSideDishPrice: formValue.price
        }
      }
    });
  }

  onSubmit() {
    this.saveOrderEntry()
  }

  onCancel() {
    this.showOrderViewService.cancelDishEntryModification()
  }
}
