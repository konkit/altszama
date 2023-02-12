import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NonNullableFormBuilder} from "@angular/forms";
import {RestaurantControllerService} from "../../../../../../frontend-client";
import {RestaurantFormService} from "../../service/restaurant-form.service";
import {tap} from "rxjs";

interface RestaurantDetails {
  name: string,
  address: string,
  url: string,
  telephone: string,
}

@Component({
  selector: 'app-edit-restaurant-form',
  templateUrl: './edit-restaurant-form.component.html',
  styleUrls: ['./edit-restaurant-form.component.scss']
})
export class EditRestaurantFormComponent implements OnInit {

  @Input() restaurantId!: string

  restaurantEditFormGroup = this.fb.group<RestaurantDetails>({
    name: "",
    address: "",
    url: "",
    telephone: "",
  })

  @Output() onCancel = new EventEmitter<void>()
  @Output() onSubmit = new EventEmitter<RestaurantDetails>()


  constructor(private fb: NonNullableFormBuilder,
              private restaurantControllerService: RestaurantControllerService,
              private restaurantFormService: RestaurantFormService,
  ) {
  }

  ngOnInit() {
    this.restaurantControllerService.editRestaurant(this.restaurantId).subscribe(({id, ...value}) => {
      this.restaurantEditFormGroup.setValue(value)
    })
  }

  cancel() {
    this.restaurantFormService.refreshRestaurantData()
  }

  submit() {
    if (this.restaurantEditFormGroup.valid) {
      const formValue = this.restaurantEditFormGroup.getRawValue();

      this.restaurantControllerService.updateRestaurant({id: this.restaurantId, ...formValue})
        .pipe(tap(() => this.restaurantFormService.refreshRestaurantData()))
        .subscribe()
    }
  }
}
