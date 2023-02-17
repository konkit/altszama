import {Component, Input, OnInit} from '@angular/core';
import {catchError, Observable, of, shareReplay, switchMap, take} from "rxjs";
import {DishControllerService, DishDto, EditDishResponse, SideDish} from "../../../../../../frontend-client";
import {NonNullableFormBuilder} from "@angular/forms";
import {RestaurantFormService} from "../../service/restaurant-form.service";

@Component({
  selector: 'app-edit-dish-form',
  templateUrl: './edit-dish-form.component.html',
  styleUrls: ['./edit-dish-form.component.scss']
})
export class EditDishFormComponent implements OnInit {
  @Input() restaurantId!: string
  @Input() dishId!: string

  editDishForm = this.fb.group({
    id: "",
    name: "",
    price: 0,
    category: "",
    sideDishes: this.fb.array<SideDish[]>([])
  })

  editData$: Observable<EditDishResponse> | null = null

  constructor(private fb: NonNullableFormBuilder,
              private dishControllerService: DishControllerService,
              private restaurantFormService: RestaurantFormService) {
  }

  ngOnInit() {
    this.editData$ = this.dishControllerService.editDish(this.restaurantId, this.dishId).pipe(shareReplay())
    this.editData$.pipe(take(1)).subscribe(response => {
      let initialFormData: DishDto = {
        id: response.dish.id,
        name: response.dish.name,
        price: response.dish.price,
        category: response.dish.category,
        sideDishes: response.dish.sideDishes
      }
      this.editDishForm.setValue(initialFormData)
    })
  }

  submitForm() {
    if (this.editDishForm.valid) {
      let body = this.editDishForm.getRawValue()
      this.dishControllerService.updateDish(body, this.restaurantId)
        .pipe(
          switchMap(() => this.restaurantFormService.refreshRestaurantData()),
          catchError(e => {
            this.editDishForm.setErrors(e)
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
