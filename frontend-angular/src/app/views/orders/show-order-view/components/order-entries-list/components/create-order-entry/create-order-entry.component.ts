import {Component, Input, OnInit} from '@angular/core';
import {map, Observable, of, startWith} from "rxjs";
import {DishDto, ShowOrderResponse} from "../../../../../../../../frontend-client";
import {ShowOrderViewService} from "../../../../service/show-order-view.service";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-create-order-entry',
  templateUrl: './create-order-entry.component.html',
  styleUrls: ['./create-order-entry.component.scss']
})
export class CreateOrderEntryComponent implements OnInit {

  @Input() orderResponse!: ShowOrderResponse

  dishes!: DishDto[]

  formGroup: FormGroup<{additionalComments: FormControl<string>, dish: FormControl<DishDto | string>, price: FormControl<number>}> = this.fb.nonNullable.group({
    dish: this.fb.nonNullable.control<DishDto | string>(''),
    price: this.fb.nonNullable.control<number>(0),
    additionalComments: this.fb.nonNullable.control<string>(''),
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
    if (typeof this.formGroup.controls.dish.value === "object") {
      let params = {
        orderId: this.orderResponse.order.id,
        additionalComments: this.formGroup.controls.additionalComments.value,
        dishId: this.formGroup.controls.dish.value.id
      }

      this.showOrderViewService.saveOrderEntryWithExistingDish(params)
        .subscribe({
          next: () => {},
          error: error => {
            this.formGroup.setErrors(error)
            return of("")
          }
        })
    } else {
      let params = {
        orderId: this.orderResponse.order.id,
        dishName: this.formGroup.controls.dish.value,
        dishPrice: this.formGroup.controls.price.value,
        additionalComments: this.formGroup.controls.additionalComments.value,
      };

      this.showOrderViewService.saveOrderEntryWithNewDish(params)
        .subscribe({
          next: () => {},
          error: error => {
            this.formGroup.setErrors(error)
            return of("")
          }
        })
    }
  }
}
