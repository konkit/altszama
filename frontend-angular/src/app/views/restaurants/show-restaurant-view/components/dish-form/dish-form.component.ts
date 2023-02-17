import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DishDto, SideDish} from "../../../../../../frontend-client";
import {FormArray, FormBuilder, FormControl, FormGroup, NonNullableFormBuilder} from "@angular/forms";
import {catchError, of, switchMap} from "rxjs";

export interface DishForm {
  name: FormControl<string>
  price: FormControl<number>
  category: FormControl<string>
  sideDishes: FormArray<FormControl<SideDish>>
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
  styleUrls: ['./dish-form.component.scss']
})
export class DishFormComponent implements OnInit {

  @Input() initialData!: DishFormData
  @Input() categories!: string[]
  @Input() dishForm!: FormGroup<DishForm>

  @Output() onCancel = new EventEmitter<void>()
  @Output() onSubmit = new EventEmitter<void>()

  constructor() {}

  ngOnInit() {
  }

  submitForm() {
    this.onSubmit.emit()
  }

  cancel() {
    this.onCancel.emit()
  }
}
