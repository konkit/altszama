import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {DishDto, SideDish, SideDishData} from "../../../../../../../../frontend-client";
import {filter, map, Observable, startWith} from "rxjs";
import {
  InitialOrderEntryFormValue,
  OrderEntryFormType,
  OrderEntryFormValue,
  SideDishForm,
  SideDishValue
} from "../../lib/formvalues";


@Component({
  selector: 'app-order-entry-form',
  templateUrl: './order-entry-form.component.html',
  styleUrls: ['./order-entry-form.component.scss']
})
export class OrderEntryFormComponent implements OnInit {
  @Input() dishIndex: number = 0;

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

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
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

  displayFn(dish: DishDto | string): string {
    if (typeof dish === "object") {
      return dish && dish.name ? dish.name : '';
    } else {
      return dish;
    }
  }

  private _filter(value: string): DishDto[] {
    const filterValue = value.toLowerCase();
    return this.dishes.filter(dish => dish.name.toLowerCase().includes(filterValue));
  }

  submitForm() {
    let obj: OrderEntryFormValue
    if (typeof this.formGroup.controls.dish.value === "object") {
      let dishObj: DishDto = this.formGroup.controls.dish.value
      if (this.formGroup.controls.price.value == dishObj.price) {
        obj = {
          kind: "Existing",
          dish: this.formGroup.controls.dish.value,
          additionalComments: this.formGroup.controls.additionalComments.value,
          chosenSideDishes: this.asSideDishDataArray(this.formGroup.controls.chosenSideDishes.value)
        }
      } else {
        obj = {
          kind: "New",
          dishName: dishObj.name,
          price: this.formGroup.controls.price.value,
          additionalComments: this.formGroup.controls.additionalComments.value,
          chosenSideDishes: this.asSideDishDataArray(this.formGroup.controls.chosenSideDishes.value),
        }
      }
    } else {
      let dishName: string = this.formGroup.controls.dish.value
      obj = {
        kind: "New",
        dishName: dishName,
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
