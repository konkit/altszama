import {Component, inject, Input, OnInit} from '@angular/core';
import {catchError, Observable, shareReplay, switchMap, take} from "rxjs";
import {DishControllerService, EditDishResponse} from "../../../../../../frontend-client";
import {FormGroup, NonNullableFormBuilder} from "@angular/forms";
import {RestaurantFormService} from "../../service/restaurant-form.service";
import {DishForm, DishFormComponent, SideDishForm} from "../dish-form/dish-form.component";
import {ErrorSnackBarService} from "../../../../../service/error-snack-bar.service";
import {DishFormPlaceholderComponent} from '../dish-form-placeholder/dish-form-placeholder.component';
import {AsyncPipe} from '@angular/common';

@Component({
    selector: 'app-edit-dish-form',
    templateUrl: './edit-dish-form.component.html',
    styleUrls: ['./edit-dish-form.component.scss'],
    standalone: true,
    imports: [DishFormComponent, DishFormPlaceholderComponent, AsyncPipe]
})
export class EditDishFormComponent implements OnInit {
  @Input() restaurantId!: string
  @Input() dishId!: string

  fb = inject(NonNullableFormBuilder);

  dishForm: FormGroup<DishForm> = this.fb.group({
    name: this.fb.control(""),
    price: this.fb.control(0),
    category: this.fb.control(""),
    sideDishes: this.fb.array<FormGroup<SideDishForm>>([])
  })

  modifyDishData$: Observable<EditDishResponse> | null = null

  constructor(private dishControllerService: DishControllerService,
              private errorSnackBar: ErrorSnackBarService,
              private restaurantFormService: RestaurantFormService) {
  }

  ngOnInit() {
    this.modifyDishData$ = this.dishControllerService.editDish(this.restaurantId, this.dishId)
      .pipe(shareReplay())
    this.modifyDishData$
      .pipe(take(1))
      .subscribe(response => {

      let initialFormData = {
        name: response.dish.name,
        price: response.dish.price,
        category: response.dish.category,
        sideDishes: []
      }
      this.dishForm.setValue(initialFormData)

      let sideDishControls = response.dish.sideDishes
        .map(sd => this.fb.group({
          name: sd.name,
          price: sd.price
        }));
      this.dishForm.controls.sideDishes = this.fb.array(sideDishControls)
    })
  }

  submitForm() {
    if (this.dishForm.valid) {
      let body = {id: this.dishId, ...this.dishForm.getRawValue()}

      console.log("Body: ", body)

      this.dishControllerService.updateDish(this.restaurantId, body)
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
