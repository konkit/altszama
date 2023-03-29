import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormControl, FormGroup} from "@angular/forms";
import {DishDto, SideDish} from "../../../../../../../../frontend-client";
import {filter, map, Observable, startWith} from "rxjs";

export interface OrderEntryFormType {
  dish: FormControl<DishDto | string>
  price: FormControl<number>
  additionalComments: FormControl<string>
  chosenSideDishes: FormArray<FormGroup<SideDishForm>>
}

export interface OrderEntryFormValue {
  dish: DishDto | string
  price: number
  additionalComments: string
}

export interface SideDishForm {
  sideDish: FormControl<string | SideDish>
  price: FormControl<number>
}

export interface SideDishValue {
  name: string
  price: number
}

@Component({
  selector: 'app-order-entry-form',
  templateUrl: './order-entry-form.component.html',
  styleUrls: ['./order-entry-form.component.scss']
})
export class OrderEntryFormComponent implements OnInit {
  @Input() formGroup!: FormGroup<OrderEntryFormType>

  @Input() dishes!: DishDto[]

  @Output() onSubmit = new EventEmitter<any>()
  @Output() onCancel = new EventEmitter<void>()

  filteredDishes!: Observable<DishDto[]>;
  availableSideDishes$!: Observable<Array<SideDish>>;

  ngOnInit() {
    this.availableSideDishes$ = this.formGroup.controls.dish.valueChanges
      .pipe(
        startWith(this.formGroup.controls.dish.value),
        filter(isDishDto),
        map(x => x.sideDishes)
      )

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

    function isDishDto(value: string | DishDto): value is DishDto {
      return typeof value === "object";
    }
  }


  onDishSelected(dish: DishDto) {
    this.formGroup.controls.price.setValue(dish.price)
  }

  displayFn(dish: DishDto): string {
    return dish && dish.name ? dish.name : '';
  }

  private _filter(value: string): DishDto[] {
    const filterValue = value.toLowerCase();
    return this.dishes.filter(dish => dish.name.toLowerCase().includes(filterValue));
  }

  submitForm() {
    setTimeout(() => this.onSubmit.emit(), 0)
  }

  cancelEdit() {
    this.onCancel.emit()
  }
}
