import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SideDish} from "../../../../../../frontend-client";
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule
} from "@angular/forms";
import {ButtonComponent} from '../../../../../components/button/button.component';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatOptionModule} from '@angular/material/core';

import {MatSelectModule} from '@angular/material/select';
import {MoneyInputComponent} from '../../../../../components/money-input/money-input.component';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

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
    imports: [MatFormFieldModule, FormsModule, ReactiveFormsModule, MatInputModule, MoneyInputComponent, MatSelectModule, MatOptionModule, MatButtonModule, MatIconModule, ButtonComponent]
})
export class DishFormComponent implements OnInit {

  @Input() initialData!: DishFormData
  @Input() categories!: string[]
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
