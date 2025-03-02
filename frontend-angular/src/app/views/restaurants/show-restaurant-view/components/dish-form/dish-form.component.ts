import {Component, EventEmitter, Input, input, OnInit, Output} from '@angular/core';
import {SideDish} from "../../../../../../frontend-client";
import {FormArray, FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule} from "@angular/forms";
import {MatIcon} from '@angular/material/icon';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatOption} from '@angular/material/core';

import {MatLabel, MatSelect} from '@angular/material/select';
import {MatInput} from '@angular/material/input';
import {MatError, MatFormField} from '@angular/material/form-field';
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

@Component({
    selector: 'app-dish-form',
    templateUrl: './dish-form.component.html',
    styleUrls: ['./dish-form.component.scss'],
    standalone: true,
  imports: [
    MatError,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatSelect,
    MatOption,
    MatIcon,
    MatIconButton,
    MatButton,
    MoneyInputComponent
  ]
})
export class DishFormComponent implements OnInit {

  readonly initialData = input<DishFormData>();
  readonly categories = input.required<string[]>();
  @Input() dishForm!: FormGroup<DishForm>

  @Output() onCancel = new EventEmitter<void>()
  @Output() onSubmit = new EventEmitter<void>()

  constructor(private fb: NonNullableFormBuilder) {}

  ngOnInit() {
  }

  submitForm() {
    this.onSubmit.emit()
  }

  cancel() {
    this.onCancel.emit()
  }

  addSideDish() {
    let control = this.fb.group({name: "", price: 0})
    this.dishForm.controls.sideDishes.push(control)
  }

  deleteSideDish(index: number) {
    this.dishForm.controls.sideDishes.removeAt(index)
  }
}
