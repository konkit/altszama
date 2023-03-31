import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {DishDto, SideDish, SideDishData} from "../../../../../../../../frontend-client";
import {filter, map, Observable, startWith} from "rxjs";
import {ShowOrderViewService} from "../../../../service/show-order-view.service";

export interface OrderEntryFormType {
  dish: FormControl<DishDto | string>
  price: FormControl<number>
  additionalComments: FormControl<string>
  chosenSideDishes: FormArray<FormGroup<SideDishForm>>
}

export interface InitialOrderEntryFormValue {
  dish: DishDto | string
  price: number
  additionalComments: string,
  chosenSideDishes: SideDish[]
}

export interface SideDishForm {
  sideDish: FormControl<string | SideDish>
  price: FormControl<number>
}

export interface SideDishValue {
  sideDish: string | SideDish
  price: number
}


export type OrderEntryFormValue = NewOrderEntryFormValue | ExistingOrderEntryFormValue
export interface NewOrderEntryFormValue {
  kind: "New"
  dishName: string
  price: number
  additionalComments: string,
  chosenSideDishes: SideDishData[]
}

export interface ExistingOrderEntryFormValue {
  kind: "Existing"
  dish: DishDto
  additionalComments: string,
  chosenSideDishes: SideDishData[]
}


@Component({
  selector: 'app-order-entry-form',
  templateUrl: './order-entry-form.component.html',
  styleUrls: ['./order-entry-form.component.scss']
})
export class OrderEntryFormComponent implements OnInit {
  // @Input() formGroup!: FormGroup<OrderEntryFormType>

  @Input() dishes!: DishDto[]
  @Input() initialValue!: InitialOrderEntryFormValue

  @Output() onSubmit = new EventEmitter<OrderEntryFormValue>()
  @Output() onCancel = new EventEmitter<void>()

  filteredDishes!: Observable<DishDto[]>;
  availableSideDishes$!: Observable<Array<SideDish>>;

  formGroup: FormGroup<OrderEntryFormType> = this.fb.nonNullable.group({
    dish: this.fb.nonNullable.control<DishDto | string>(''),
    price: this.fb.nonNullable.control<number>(0),
    additionalComments: this.fb.nonNullable.control<string>(''),
    chosenSideDishes: this.fb.nonNullable.array<FormGroup<SideDishForm>>([])
  });

  constructor(private fb: FormBuilder,
              private showOrderViewService: ShowOrderViewService) {
    this.showOrderViewService.setEntryLoading(true)
  }

  ngOnInit() {
    this.showOrderViewService.setEntryLoading(false)

    this.formGroup.setValue({
      dish: this.initialValue.dish,
      price: this.initialValue.price,
      additionalComments: this.initialValue.additionalComments,
      chosenSideDishes: [],
    })
    let sideDishControls = this.initialValue.chosenSideDishes
      .map(sd => this.fb.nonNullable.group({
        sideDish: this.fb.nonNullable.control<string | SideDish>(sd.name),
        price: this.fb.nonNullable.control(sd.price)
      }));
    this.formGroup.controls.chosenSideDishes = this.fb.nonNullable.array(sideDishControls)

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
    //TODO: Handle if someone selected existing dish, but changed the price,
    // effectively making it a new dish

    let obj: OrderEntryFormValue
    if (typeof this.formGroup.controls.dish.value === "object") {
      obj = {
        kind: "Existing",
        dish: this.formGroup.controls.dish.value,
        additionalComments: this.formGroup.controls.additionalComments.value,
        chosenSideDishes: this.asSideDishDataArray(this.formGroup.controls.chosenSideDishes.value)
      }
    } else {
      obj = {
        kind: "New",
        dishName: this.formGroup.controls.dish.value,
        price: this.formGroup.controls.price.value,
        additionalComments: this.formGroup.controls.additionalComments.value,
        chosenSideDishes: this.asSideDishDataArray(this.formGroup.controls.chosenSideDishes.value),
      }
    }

    setTimeout(() => this.onSubmit.emit(obj), 0)
  }

  cancelEdit() {
    this.onCancel.emit()
  }

  private asSideDishDataArray(formArray: Partial<SideDishValue>[]): SideDishData[] {
    return formArray.map(formValue => {
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
}
