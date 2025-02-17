import {Component, inject} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Router} from "@angular/router";
import {catchError, tap} from "rxjs";
import {RestaurantControllerService} from "../../../../frontend-client";
import {ErrorSnackBarService} from "../../../service/error-snack-bar.service";
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {ViewWrapperComponent} from '../../../components/view-wrapper/view-wrapper.component';
import {MatButton} from '@angular/material/button';

@Component({
    selector: 'app-create-restaurant-view',
    templateUrl: './create-restaurant-view.component.html',
    styleUrls: ['./create-restaurant-view.component.scss'],
    standalone: true,
  imports: [ViewWrapperComponent, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButton]
})
export class CreateRestaurantViewComponent {

  fb = inject(FormBuilder)
  restaurantFormGroup = this.fb.group({
    name: "",
    address: "",
    url: "",
    telephone: "",
  })

  constructor(private router: Router,
              private restaurantControllerService: RestaurantControllerService,
              private errorSnackBar: ErrorSnackBarService) {
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
      .pipe(
        tap(restaurant => {
          this.router.navigate(['/restaurants/', restaurant.id], {onSameUrlNavigation: "reload"})
        }),
        catchError(err => {
          this.errorSnackBar.displayError(err)
          throw err
        })
      ).subscribe()
  }

  cancel() {
    this.router.navigate(['/restaurants'])
  }
}
