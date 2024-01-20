import {Component, Input} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SideDish} from "../../../../../../../../frontend-client";
import {SideDishForm} from "../../lib/formvalues";
import {PricePipe} from '../../../../../../../components/pipes/price.pipe';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MoneyInputComponent} from '../../../../../../../components/money-input/money-input.component';
import {MatOptionModule} from '@angular/material/core';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';


@Component({
    selector: 'app-side-dishes-input',
    templateUrl: './side-dishes-input.component.html',
    styleUrls: ['./side-dishes-input.component.scss'],
    standalone: true,
    imports: [MatFormFieldModule, MatInputModule, FormsModule, MatAutocompleteModule, ReactiveFormsModule, MatOptionModule, MoneyInputComponent, MatButtonModule, MatIconModule, PricePipe]
})
export class SideDishesInputComponent {
  @Input() availableSideDishes!: SideDish[] | null
  @Input() chosenSideDishes!: FormArray<FormGroup<SideDishForm>>

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
