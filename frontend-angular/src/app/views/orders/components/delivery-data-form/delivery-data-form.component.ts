import {Component, input} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MoneyInputComponent} from '../../../../components/money-input/money-input.component';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';


export interface DeliveryDataForm {
  decreaseInPercent: FormControl<number>,
  deliveryCostPerEverybody: FormControl<number>,
  deliveryCostPerDish: FormControl<number>,
}

@Component({
    selector: 'app-delivery-data-form',
    templateUrl: './delivery-data-form.component.html',
    styleUrls: ['./delivery-data-form.component.scss'],
    standalone: true,
    imports: [MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, MoneyInputComponent]
})
export class DeliveryDataFormComponent {

  readonly deliveryDataForm = input.required<FormGroup<DeliveryDataForm>>();


}
