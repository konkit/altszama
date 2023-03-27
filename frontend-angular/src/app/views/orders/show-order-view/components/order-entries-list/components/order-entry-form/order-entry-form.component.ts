import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {DishDto} from "../../../../../../../../frontend-client";
import {map, Observable, startWith} from "rxjs";

@Component({
  selector: 'app-order-entry-form',
  templateUrl: './order-entry-form.component.html',
  styleUrls: ['./order-entry-form.component.scss']
})
export class OrderEntryFormComponent implements OnInit {
  @Input() formGroup!: FormGroup<{additionalComments: FormControl<string>, dish: FormControl<DishDto | string>, price: FormControl<number>}>

  @Input() dishes!: DishDto[]

  @Output() onSubmit = new EventEmitter<any>()
  @Output() onCancel = new EventEmitter<void>()

  filteredDishes!: Observable<DishDto[]>;

  ngOnInit() {
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
    setTimeout(() => this.onSubmit.emit(), 0)
  }

  cancelEdit() {
    this.onCancel.emit()
  }
}
