import {Component, Input, OnInit} from '@angular/core';
import {catchError, Observable, of, shareReplay, switchMap, take} from "rxjs";
import {DishControllerService, EditDishResponse} from "../../../../../../frontend-client";
import {FormGroup, NonNullableFormBuilder} from "@angular/forms";
import {RestaurantFormService} from "../../service/restaurant-form.service";
import {DishForm, SideDishForm} from "../dish-form/dish-form.component";

@Component({
  selector: 'app-edit-dish-form',
  templateUrl: './edit-dish-form.component.html',
  styleUrls: ['./edit-dish-form.component.scss']
})
export class EditDishFormComponent implements OnInit {
  @Input() restaurantId!: string
  @Input() dishId!: string

  dishForm: FormGroup<DishForm> = this.fb.group({
    name: this.fb.control(""),
    price: this.fb.control(0),
    category: this.fb.control(""),
    sideDishes: this.fb.array<FormGroup<SideDishForm>>([])
  })

  modifyDishData$: Observable<EditDishResponse> | null = null

  constructor(private fb: NonNullableFormBuilder,
              private dishControllerService: DishControllerService,
              private restaurantFormService: RestaurantFormService) {
  }

  ngOnInit() {
    this.modifyDishData$ = this.dishControllerService.editDish(this.restaurantId, this.dishId).pipe(shareReplay())
    this.modifyDishData$.pipe(take(1)).subscribe(response => {

      console.log("response: ", response)

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
