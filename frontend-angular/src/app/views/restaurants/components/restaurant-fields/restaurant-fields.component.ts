import {Component, input, ChangeDetectionStrategy} from '@angular/core';
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {RestaurantForm} from "../../lib/restaurantForm";

// Name, address, menu URL and phone fields shared by the create and edit restaurant forms
@Component({
  selector: 'app-restaurant-fields',
  templateUrl: './restaurant-fields.component.html',
  styleUrls: ['./restaurant-fields.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule]
})
export class RestaurantFieldsComponent {
  readonly form = input.required<FormGroup<RestaurantForm>>();
}
