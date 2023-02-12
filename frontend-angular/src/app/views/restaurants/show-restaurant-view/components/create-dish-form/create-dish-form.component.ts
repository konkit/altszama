import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, NgForm, NonNullableFormBuilder} from "@angular/forms";
import {Observable} from "rxjs";
import {CreateDishResponse, DishControllerService, DishCreateRequest} from "../../../../../../frontend-client";
import {RestaurantEditorState, RestaurantFormService} from "../../service/restaurant-form.service";

@Component({
  selector: 'app-create-dish-form',
  templateUrl: './create-dish-form.component.html',
  styleUrls: ['./create-dish-form.component.scss']
})
export class CreateDishFormComponent implements OnInit {

  @Input() restaurantId!: string

  @Output() createSucceded = new EventEmitter<void>()

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

  submitCreateDishForm() {
    if (this.createDishForm.valid) {
      let body = this.createDishForm.getRawValue()
      console.log(body)
      this.dishControllerService.saveDish(body, this.restaurantId).subscribe(response => {
        console.log(response)
        this.createSucceded.emit()
      })
    }
  }

  cancelCreatingDish() {
    this.restaurantFormService.setEditorState(RestaurantEditorState.IDLE)
  }
}
