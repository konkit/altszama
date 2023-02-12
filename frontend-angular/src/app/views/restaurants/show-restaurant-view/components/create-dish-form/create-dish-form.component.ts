import {Component, Input, OnInit} from '@angular/core';
import {NonNullableFormBuilder} from "@angular/forms";
import {BehaviorSubject, catchError, Observable, of, switchMap} from "rxjs";
import {CreateDishResponse, DishControllerService} from "../../../../../../frontend-client";
import {RestaurantFormService} from "../../service/restaurant-form.service";

@Component({
  selector: 'app-create-dish-form',
  templateUrl: './create-dish-form.component.html',
  styleUrls: ['./create-dish-form.component.scss']
})
export class CreateDishFormComponent implements OnInit {

  @Input() restaurantId!: string

  createDishForm = this.fb.group({
    name: "",
    price: 0,
    category: "",
    sideDishes: [[]]
  })

  createData$: Observable<CreateDishResponse> | null = null

  constructor(private fb: NonNullableFormBuilder,
              private dishControllerService: DishControllerService,
              private restaurantFormService: RestaurantFormService) {
  }

  ngOnInit() {
    this.createData$ = this.dishControllerService.createDish(this.restaurantId)
  }

  submitForm() {
    if (this.createDishForm.valid) {
      let body = this.createDishForm.getRawValue()
      this.dishControllerService.saveDish(body, this.restaurantId)
        .pipe(
          switchMap(() => this.restaurantFormService.refreshRestaurantData()),
          catchError(e => {
            this.createDishForm.setErrors(e)
            return of("")
          })
        )
        .subscribe()
    }
  }

  cancel() {
    this.restaurantFormService.refreshRestaurantData().subscribe()
  }
}
