import {Component, Input, OnInit} from '@angular/core';
import {NonNullableFormBuilder, Validators} from "@angular/forms";
import {catchError, Observable, of, switchMap} from "rxjs";
import {CreateDishResponse, DishControllerService, SideDish} from "../../../../../../frontend-client";
import {RestaurantFormService} from "../../service/restaurant-form.service";

@Component({
  selector: 'app-create-dish-form',
  templateUrl: './create-dish-form.component.html',
  styleUrls: ['./create-dish-form.component.scss']
})
export class CreateDishFormComponent implements OnInit {

  @Input() restaurantId!: string

  dishForm = this.fb.group({
    name: ["", Validators.required],
    price: 0,
    category: "",
    sideDishes: this.fb.array<SideDish[]>([])
  })

  modifyDishData$: Observable<CreateDishResponse> | null = null

  constructor(private fb: NonNullableFormBuilder,
              private dishControllerService: DishControllerService,
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
          catchError(e => {
            this.dishForm.setErrors(e)
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
