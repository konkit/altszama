import { Component } from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {Router} from "@angular/router";
import {switchMap, take, tap} from "rxjs";
import {RestaurantControllerService} from "../../../../frontend-client";

@Component({
  selector: 'app-create-restaurant-view',
  templateUrl: './create-restaurant-view.component.html',
  styleUrls: ['./create-restaurant-view.component.scss']
})
export class CreateRestaurantViewComponent {
  restaurantFormGroup = this.fb.group({
    name: "",
    address: "",
    url: "",
    telephone: "",
  })

  constructor(private fb: FormBuilder, private router: Router, private restaurantControllerService: RestaurantControllerService) {
  }

  submit() {
    const formValue = this.restaurantFormGroup.value;

    let body = {
      name: formValue.name || "",
      url: formValue.url || "",
      address: formValue.address || "",
      telephone: formValue.telephone || ""
    };

    return this.restaurantControllerService.saveRestaurant(body)
      .pipe(tap(restaurantId => {
        this.router.navigate(['/restaurants/', restaurantId], {onSameUrlNavigation: "reload"})
      })).subscribe()
  }

  cancel() {
    this.router.navigate(['/restaurants'])
  }
}
