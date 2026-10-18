import {Component, inject} from '@angular/core';
import {NonNullableFormBuilder} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {RestaurantControllerService} from "../../../../frontend-client";
import {ErrorSnackBarService} from "../../../service/error-snack-bar.service";
import {ViewWrapperComponent} from '../../../components/view-wrapper/view-wrapper.component';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {RestaurantFieldsComponent} from '../components/restaurant-fields/restaurant-fields.component';
import {createRestaurantForm} from '../lib/restaurantForm';

@Component({
    selector: 'app-create-restaurant-view',
    templateUrl: './create-restaurant-view.component.html',
    styleUrls: ['./create-restaurant-view.component.scss'],
    standalone: true,
  imports: [ViewWrapperComponent, RestaurantFieldsComponent, MatButtonModule, MatCardModule, MatIconModule, RouterLink]
})
export class CreateRestaurantViewComponent {

  restaurantFormGroup = createRestaurantForm(inject(NonNullableFormBuilder))

  isSaving = false

  constructor(private router: Router,
              private restaurantControllerService: RestaurantControllerService,
              private errorSnackBar: ErrorSnackBarService) {
  }

  submit(e: Event) {
    e.preventDefault()

    if (this.restaurantFormGroup.invalid) {
      this.restaurantFormGroup.markAllAsTouched()
      return
    }

    const formValue = this.restaurantFormGroup.getRawValue();
    const body = {
      name: formValue.name.trim(),
      url: formValue.url.trim(),
      address: formValue.address.trim(),
      telephone: formValue.telephone.trim()
    };

    this.isSaving = true
    this.restaurantControllerService.saveRestaurant(body).subscribe({
      next: restaurant => this.router.navigate(['/restaurants/', restaurant.id], {onSameUrlNavigation: "reload"}),
      error: err => {
        this.isSaving = false
        this.errorSnackBar.displayError(err)
      }
    })
  }

  cancel() {
    this.router.navigate(['/restaurants'])
  }
}
