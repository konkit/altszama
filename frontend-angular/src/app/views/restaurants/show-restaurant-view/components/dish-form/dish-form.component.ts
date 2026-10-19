import {Component, EventEmitter, Input, input, Output, ChangeDetectionStrategy} from '@angular/core';
import {SideDish} from "../../../../../../frontend-client";
import {FormArray, FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatIcon} from '@angular/material/icon';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatOption} from '@angular/material/core';
import {MatInput} from '@angular/material/input';
import {MatError, MatFormField, MatHint, MatLabel} from '@angular/material/form-field';
import {MatAutocomplete, MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {MatTooltip} from '@angular/material/tooltip';
import {MoneyInputComponent} from '../../../../../components/money-input/money-input.component';

export interface DishForm {
  name: FormControl<string>
  price: FormControl<number>
  category: FormControl<string>
  sideDishes: FormArray<FormGroup<SideDishForm>>
}

export interface SideDishForm {
  name: FormControl<string>
  price: FormControl<number>
}

export interface DishFormData {
  name: string
  price: number
  category: string
  sideDishes: SideDish[]
}

// The same rules for creating and editing a dish
export function createDishForm(fb: NonNullableFormBuilder, sideDishes: SideDish[] = []): FormGroup<DishForm> {
  return fb.group({
    name: fb.control("", Validators.required),
    price: fb.control(0, [Validators.required, Validators.min(0)]),
    category: fb.control(""),
    sideDishes: fb.array(sideDishes.map(sideDish => createSideDishForm(fb, sideDish.name, sideDish.price)))
  })
}

function createSideDishForm(fb: NonNullableFormBuilder, name = "", price = 0): FormGroup<SideDishForm> {
  return fb.group({
    name: fb.control(name, Validators.required),
    price: fb.control(price, Validators.min(0)),
  })
}

@Component({
    selector: 'app-dish-form',
    templateUrl: './dish-form.component.html',
    styleUrls: ['./dish-form.component.scss'],
    standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    MatError,
    MatHint,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatOption,
    MatAutocomplete,
    MatAutocompleteTrigger,
    MatIcon,
    MatIconButton,
    MatButton,
    MatTooltip,
    MoneyInputComponent
  ]
})
export class DishFormComponent {

  readonly initialData = input<DishFormData>();
  readonly categories = input.required<string[]>();
  @Input() dishForm!: FormGroup<DishForm>

  @Output() onCancel = new EventEmitter<void>()
  @Output() onSubmit = new EventEmitter<void>()

  constructor(private fb: NonNullableFormBuilder) {}

  // Existing categories matching what's typed; any other text creates a new category
  matchingCategories(): string[] {
    const typed = this.dishForm.controls.category.value.trim().toLowerCase()
    return this.categories()
      .filter(category => category && category.toLowerCase().includes(typed))
  }

  submitForm(e: Event) {
    e.preventDefault()

    if (this.dishForm.invalid) {
      this.dishForm.markAllAsTouched()
      return
    }
    this.dishForm.controls.category.setValue(this.dishForm.controls.category.value.trim())
    this.onSubmit.emit()
  }

  cancel() {
    this.onCancel.emit()
  }

  addSideDish() {
    this.dishForm.controls.sideDishes.push(createSideDishForm(this.fb))
  }

  deleteSideDish(index: number) {
    this.dishForm.controls.sideDishes.removeAt(index)
  }
}
