import {Component, Input, OnInit} from '@angular/core';
import {catchError, Observable, of, shareReplay, switchMap, take} from "rxjs";
import {DishControllerService, DishDto, EditDishResponse, SideDish} from "../../../../../../frontend-client";
import {NonNullableFormBuilder} from "@angular/forms";
import {RestaurantFormService} from "../../service/restaurant-form.service";
import {DishFormData} from "../dish-form/dish-form.component";

@Component({
  selector: 'app-edit-dish-form',
  templateUrl: './edit-dish-form.component.html',
  styleUrls: ['./edit-dish-form.component.scss']
})
export class EditDishFormComponent implements OnInit {
  @Input() restaurantId!: string
  @Input() dishId!: string

  dishForm = this.fb.group({
    name: "",
    price: 0,
    category: "",
    sideDishes: this.fb.array<SideDish[]>([])
  })

  modifyDishData$: Observable<EditDishResponse> | null = null

  constructor(private fb: NonNullableFormBuilder,
              private dishControllerService: DishControllerService,
              private restaurantFormService: RestaurantFormService) {
  }

  ngOnInit() {
    this.modifyDishData$ = this.dishControllerService.editDish(this.restaurantId, this.dishId).pipe(shareReplay())
    this.modifyDishData$.pipe(take(1)).subscribe(response => {
      let initialFormData: DishFormData = {
        name: response.dish.name,
        price: response.dish.price,
        category: response.dish.category,
        sideDishes: response.dish.sideDishes
      }
      this.dishForm.setValue(initialFormData)
    })
  }

  submitForm() {
    if (this.dishForm.valid) {
      let body = {id: this.dishId, ...this.dishForm.getRawValue()}
      this.dishControllerService.updateDish(body, this.restaurantId)
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
