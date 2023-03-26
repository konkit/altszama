import {Component, Input, OnInit} from '@angular/core';
import {map, Observable, of, startWith} from "rxjs";
import {DishDto, OrderEntryControllerService, ShowOrderResponse} from "../../../../../../../../frontend-client";
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
  filteredDishes!: Observable<DishDto[]>;

  formGroup = this.fb.nonNullable.group({
    dish: this.fb.nonNullable.control<DishDto | string>('', {}),
    price: this.fb.nonNullable.control<number>(0, {}),
    additionalComments: this.fb.nonNullable.control<string>('', {}),
  });

  constructor(private showOrderViewService: ShowOrderViewService,
              private fb: FormBuilder) {
    this.showOrderViewService.setEntryLoading(true)
  }

  ngOnInit() {
    this.dishes = this.orderResponse.allDishesInRestaurant
    this.filteredDishes = this.formGroup.controls.dish.valueChanges.pipe(
      startWith(''),
      map(nameOrDish => {
        let filterPhrase
        if (typeof nameOrDish == "object") {
          let dish: DishDto = nameOrDish
          filterPhrase = dish.name
        } else {
          filterPhrase = nameOrDish || ''
        }
        return this._filter(filterPhrase)
      }),
    );
    this.showOrderViewService.setEntryLoading(false)
  }

  private _filter(value: string): DishDto[] {
    const filterValue = value.toLowerCase();
    return this.dishes.filter(dish => dish.name.toLowerCase().includes(filterValue));
  }

  submitForm() {
    // Set timeout is necessary to properly handle last-minute updates in form controls
    setTimeout(() => this.saveOrderEntry(), 0)
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

  cancelEdit() {
    this.showOrderViewService.cancelDishEntryModification()
  }

  onDishSelected(dish: DishDto) {
    console.log("On dish selected", dish)
    this.formGroup.controls.price.setValue(dish.price)
  }

  displayFn(dish: DishDto): string {
    return dish && dish.name ? dish.name : '';
  }
}
