import {Component, Input, OnInit} from '@angular/core';
import {of} from "rxjs";
import {DishDto, ShowOrderResponse, SideDish} from "../../../../../../../../frontend-client";
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

  onSubmit() {
    this.saveOrderEntry()
  }

  onCancel() {
    this.showOrderViewService.cancelDishEntryModification()
  }

  private saveOrderEntry() {
    let dishValue = this.formGroup.controls.dish.value;
    if (typeof dishValue === "object") {
      let sideDishes = this.asSideDishArray(this.formGroup.controls.chosenSideDishes);
      let params = {
        orderId: this.orderResponse.order.id,
        additionalComments: this.formGroup.controls.additionalComments.value,
        dishId: dishValue.id,
        sideDishes: sideDishes,
      }

      this.showOrderViewService.saveOrderEntryWithExistingDish(params)
        .subscribe({
          next: () => {
          },
          error: error => {
            this.formGroup.setErrors(error)
            return of("")
          }
        })
    } else {
      let sideDishes = this.asSideDishArray(this.formGroup.controls.chosenSideDishes);
      let params = {
        orderId: this.orderResponse.order.id,
        dishName: dishValue,
        dishPrice: this.formGroup.controls.price.value,
        additionalComments: this.formGroup.controls.additionalComments.value,
        sideDishes: sideDishes,
      };

      this.showOrderViewService.saveOrderEntryWithNewDish(params)
        .subscribe({
          next: () => {
          },
          error: error => {
            this.formGroup.setErrors(error)
            return of("")
          }
        })
    }
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

  isDishDto(value: string | DishDto): value is DishDto {
    return typeof value === "object";
  }

  isSideDishObj(value: string | SideDish): value is SideDish {
    return typeof value === "object"
  }
}
