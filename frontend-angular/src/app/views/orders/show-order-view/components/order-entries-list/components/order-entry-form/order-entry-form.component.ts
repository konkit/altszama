import {Component, EventEmitter, inject, input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DishDto, SideDish, SideDishData} from "../../../../../../../../frontend-client";
import {filter, map, Observable, startWith} from "rxjs";
import {
  InitialOrderEntryFormValue,
  OrderEntryFormType,
  OrderEntryFormValue,
  SideDishForm,
  SideDishValue
} from "../../lib/formvalues";
import {RelativeDatePipe} from '../../../../../../../components/pipes/date-to-rel.pipe';
import {PricePipe} from '../../../../../../../components/pipes/price.pipe';
import {SideDishesInputComponent} from '../side-dishes-input/side-dishes-input.component';
import {MoneyInputComponent} from '../../../../../../../components/money-input/money-input.component';
import {MatOptionModule} from '@angular/material/core';
import {AsyncPipe} from '@angular/common';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButton} from '@angular/material/button';


@Component({
    selector: 'app-order-entry-form',
    templateUrl: './order-entry-form.component.html',
    styleUrls: ['./order-entry-form.component.scss'],
    standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule, MatOptionModule, MoneyInputComponent, SideDishesInputComponent, AsyncPipe, PricePipe, RelativeDatePipe, MatButton]
})
export class OrderEntryFormComponent implements OnInit {
  readonly dishIndex = input<number>(0);

  readonly dishes = input.required<DishDto[]>();
  readonly initialValue = input.required<InitialOrderEntryFormValue>();

  @Output() onSubmit = new EventEmitter<OrderEntryFormValue>()
  @Output() onCancel = new EventEmitter<void>()

  filteredDishes!: Observable<DishDto[]>;
  availableSideDishes$!: Observable<Array<SideDish>>;

  fb = inject(FormBuilder)

  formGroup: FormGroup<OrderEntryFormType> = this.fb.nonNullable.group({
    dish: this.fb.nonNullable.control<DishDto | string>(''),
    price: this.fb.nonNullable.control<number>(0),
    additionalComments: this.fb.nonNullable.control<string>(''),
    chosenSideDishes: this.fb.nonNullable.array<FormGroup<SideDishForm>>([])
  });

  ngOnInit() {
    const initialValue = this.initialValue();
    this.formGroup.setValue({
      dish: initialValue.dish,
      price: initialValue.price,
      additionalComments: initialValue.additionalComments,
      chosenSideDishes: [],
    })
    let sideDishControls = initialValue.chosenSideDishes
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
    return this.dishes().filter(dish => dish.name.toLowerCase().includes(filterValue));
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
