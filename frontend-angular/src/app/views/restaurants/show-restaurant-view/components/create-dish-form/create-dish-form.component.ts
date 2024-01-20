import {Component, Input, OnInit} from '@angular/core';
import {FormGroup, NonNullableFormBuilder, Validators} from "@angular/forms";
import {catchError, Observable, switchMap} from "rxjs";
import {CreateDishResponse, DishControllerService} from "../../../../../../frontend-client";
import {RestaurantFormService} from "../../service/restaurant-form.service";
import {DishFormComponent, SideDishForm} from "../dish-form/dish-form.component";
import {ErrorSnackBarService} from "../../../../../service/error-snack-bar.service";
import {DishFormPlaceholderComponent} from '../dish-form-placeholder/dish-form-placeholder.component';
import {AsyncPipe, NgIf} from '@angular/common';

@Component({
    selector: 'app-create-dish-form',
    templateUrl: './create-dish-form.component.html',
    styleUrls: ['./create-dish-form.component.scss'],
    standalone: true,
    imports: [NgIf, DishFormComponent, DishFormPlaceholderComponent, AsyncPipe]
})
export class CreateDishFormComponent implements OnInit {

  @Input() restaurantId!: string

  dishForm = this.fb.group({
    name: ["", Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    category: "",
    sideDishes: this.fb.array<FormGroup<SideDishForm>>([])
  })

  modifyDishData$: Observable<CreateDishResponse> | null = null

  constructor(private fb: NonNullableFormBuilder,
              private dishControllerService: DishControllerService,
              private errorSnackBar: ErrorSnackBarService,
              private restaurantFormService: RestaurantFormService) {
  }

  ngOnInit() {
    this.modifyDishData$ = this.dishControllerService.createDish(this.restaurantId)
  }

  submitForm() {
    if (this.dishForm.valid) {
      let body = this.dishForm.getRawValue()
      this.dishControllerService.saveDish(body, this.restaurantId)
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
