import {Component, inject, input, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {NonNullableFormBuilder} from "@angular/forms";
import {RestaurantControllerService} from "../../../../../../frontend-client";
import {RestaurantFormService} from "../../service/restaurant-form.service";
import {switchMap} from "rxjs";
import {ErrorSnackBarService} from "../../../../../service/error-snack-bar.service";
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {RestaurantFieldsComponent} from '../../../components/restaurant-fields/restaurant-fields.component';
import {createRestaurantForm} from '../../../lib/restaurantForm';

@Component({
  selector: 'app-edit-restaurant-form',
  templateUrl: './edit-restaurant-form.component.html',
  styleUrls: ['./edit-restaurant-form.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [RestaurantFieldsComponent, MatButtonModule, MatIconModule]
})
export class EditRestaurantFormComponent implements OnInit {

  readonly restaurantId = input.required<string>();

  restaurantEditFormGroup = createRestaurantForm(inject(NonNullableFormBuilder))

  isSaving = false

  constructor(private restaurantControllerService: RestaurantControllerService,
              private errorSnackBar: ErrorSnackBarService,
              private restaurantFormService: RestaurantFormService,
  ) {
  }

  ngOnInit() {
    this.restaurantControllerService.editRestaurant(this.restaurantId())
      .subscribe({
        next: restaurant => this.restaurantEditFormGroup.setValue({
          name: restaurant.name ?? "",
          address: restaurant.address ?? "",
          url: restaurant.url ?? "",
          telephone: restaurant.telephone ?? "",
        }),
        error: err => this.errorSnackBar.displayError(err)
      })
  }

  cancel() {
    this.restaurantFormService.refreshRestaurantData().subscribe()
  }

  submit(e: Event) {
    e.preventDefault()

    if (this.restaurantEditFormGroup.invalid) {
      this.restaurantEditFormGroup.markAllAsTouched()
      return
    }

    const formValue = this.restaurantEditFormGroup.getRawValue();

    this.isSaving = true
    this.restaurantControllerService.updateRestaurant({id: this.restaurantId(), ...formValue})
      .pipe(switchMap(() => this.restaurantFormService.refreshRestaurantData()))
      .subscribe({
        error: err => {
          this.isSaving = false
          this.errorSnackBar.displayError(err)
        }
      })
  }
}
