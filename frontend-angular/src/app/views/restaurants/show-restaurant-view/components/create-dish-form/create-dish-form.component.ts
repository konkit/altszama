import {Component, inject, input, OnInit} from '@angular/core';
import {NonNullableFormBuilder} from "@angular/forms";
import {catchError, Observable, switchMap} from "rxjs";
import {CreateDishResponse, DishControllerService} from "../../../../../../frontend-client";
import {RestaurantFormService} from "../../service/restaurant-form.service";
import {createDishForm, DishFormComponent} from "../dish-form/dish-form.component";
import {ErrorSnackBarService} from "../../../../../service/error-snack-bar.service";
import {DishFormPlaceholderComponent} from '../dish-form-placeholder/dish-form-placeholder.component';
import {AsyncPipe} from '@angular/common';

@Component({
    selector: 'app-create-dish-form',
    templateUrl: './create-dish-form.component.html',
    styleUrls: ['./create-dish-form.component.scss'],
    standalone: true,
    imports: [DishFormComponent, DishFormPlaceholderComponent, AsyncPipe]
})
export class CreateDishFormComponent implements OnInit {

  readonly restaurantId = input.required<string>();

  fb = inject(NonNullableFormBuilder);

  dishForm = createDishForm(this.fb)

  modifyDishData$: Observable<CreateDishResponse> | null = null

  constructor(private dishControllerService: DishControllerService,
              private errorSnackBar: ErrorSnackBarService,
              private restaurantFormService: RestaurantFormService) {
  }

  ngOnInit() {
    this.modifyDishData$ = this.dishControllerService.createDish(this.restaurantId())
  }

  submitForm() {
    if (this.dishForm.valid) {
      let body = this.dishForm.getRawValue()
      this.dishControllerService.saveDish(this.restaurantId(), body)
        .pipe(
          switchMap(() => this.restaurantFormService.refreshRestaurantData()),
          catchError(err => {
            this.errorSnackBar.displayError(err)
            throw err
          })
        )
        .subscribe()
    }
  }

  cancel() {
    this.restaurantFormService.refreshRestaurantData().subscribe()
  }
}
