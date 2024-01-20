import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormsModule, NonNullableFormBuilder, ReactiveFormsModule} from "@angular/forms";
import {RestaurantControllerService} from "../../../../../../frontend-client";
import {RestaurantFormService} from "../../service/restaurant-form.service";
import {catchError, switchMap} from "rxjs";
import {ErrorSnackBarService} from "../../../../../service/error-snack-bar.service";
import {ButtonComponent} from '../../../../../components/button/button.component';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

interface RestaurantDetails {
  name: string,
  address: string,
  url: string,
  telephone: string,
}

@Component({
    selector: 'app-edit-restaurant-form',
    templateUrl: './edit-restaurant-form.component.html',
    styleUrls: ['./edit-restaurant-form.component.scss'],
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, ButtonComponent]
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
              private errorSnackBar: ErrorSnackBarService,
              private restaurantFormService: RestaurantFormService,
  ) {
  }

  ngOnInit() {
    this.restaurantControllerService.editRestaurant(this.restaurantId)
      .pipe(
        catchError(err => {
          this.errorSnackBar.displayError(err)
          throw err
        })
      )
      .subscribe(({id, ...value}) => this.restaurantEditFormGroup.setValue(value))
  }

  cancel() {
    this.restaurantFormService.refreshRestaurantData().subscribe()
  }

  submit() {
    if (this.restaurantEditFormGroup.valid) {
      const formValue = this.restaurantEditFormGroup.getRawValue();

      this.restaurantControllerService.updateRestaurant({id: this.restaurantId, ...formValue})
        .pipe(
          switchMap(() => this.restaurantFormService.refreshRestaurantData()),
          catchError(err => {
            this.errorSnackBar.displayError(err)
            throw err
          })
        )
        .subscribe()
    }
  }
}
