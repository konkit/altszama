import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SideDish} from "../../../../../../frontend-client";
import {FormArray, FormControl, FormGroup, NonNullableFormBuilder} from "@angular/forms";
import {faAdd, faTimes} from "@fortawesome/free-solid-svg-icons";

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
  styleUrls: ['./dish-form.component.scss']
})
export class DishFormComponent implements OnInit {

  @Input() initialData!: DishFormData
  @Input() categories!: string[]
  @Input() dishForm!: FormGroup<DishForm>

  @Output() onCancel = new EventEmitter<void>()
  @Output() onSubmit = new EventEmitter<void>()
  faAdd = faAdd
  faTimes = faTimes;

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
