import {Component, Input} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {PaymentDataForm} from "../payment-data-form/payment-data-form.component";


export interface DeliveryDataForm {
  decreaseInPercent: FormControl<number>,
  deliveryCostPerEverybody: FormControl<number>,
  deliveryCostPerDish: FormControl<number>,
}

@Component({
  selector: 'app-delivery-data-form',
  templateUrl: './delivery-data-form.component.html',
  styleUrls: ['./delivery-data-form.component.scss']
})
export class DeliveryDataFormComponent {

  @Input() deliveryDataForm!: FormGroup<DeliveryDataForm>


}
