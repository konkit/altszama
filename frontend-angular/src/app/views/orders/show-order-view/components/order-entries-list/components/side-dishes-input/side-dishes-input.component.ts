import {Component, Input} from '@angular/core';
import {faRemove} from "@fortawesome/free-solid-svg-icons";
import {SideDishForm} from "../order-entry-form/order-entry-form.component";
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {SideDish} from "../../../../../../../../frontend-client";

@Component({
  selector: 'app-side-dishes-input',
  templateUrl: './side-dishes-input.component.html',
  styleUrls: ['./side-dishes-input.component.scss']
})
export class SideDishesInputComponent {
  @Input() availableSideDishes!: SideDish[] | null
  @Input() chosenSideDishes!: FormArray<FormGroup<SideDishForm>>

  faRemove = faRemove

  constructor(private fb: FormBuilder) {
  }

  addSideDishEntry() {
    let formGroup = this.fb.nonNullable.group({
      sideDish: this.fb.nonNullable.control<SideDish | string>(""),
      price: this.fb.nonNullable.control<number>(0)
    })

    this.chosenSideDishes.push(formGroup)
  }

  removeSideDish(sdIndex: number) {
    this.chosenSideDishes.removeAt(sdIndex)
  }

  onSideDishSelected(sideDish: SideDish | string, sdIndex: number) {
    if (typeof sideDish === "object") {
      this.chosenSideDishes.controls.at(sdIndex)?.controls.price.setValue(sideDish.price)
    }
  }

  displayFn(sideDish: SideDish | string): string {
    if (typeof sideDish === "string") {
      return sideDish
    } else {
      return sideDish && sideDish.name ? sideDish.name : '';
    }
  }
}
