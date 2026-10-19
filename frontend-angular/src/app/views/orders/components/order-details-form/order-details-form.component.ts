import {Component, input, ChangeDetectionStrategy} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {MatCardModule} from '@angular/material/card';
import {OrderTimeFormComponent} from '../order-time-form/order-time-form.component';
import {DeliveryDataForm, DeliveryDataFormComponent} from '../delivery-data-form/delivery-data-form.component';
import {PaymentDataForm, PaymentDataFormComponent} from '../payment-data-form/payment-data-form.component';

// Timing, fees and payment sections shared by the create and edit order views
@Component({
  selector: 'app-order-details-form',
  templateUrl: './order-details-form.component.html',
  styleUrls: ['./order-details-form.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatCardModule, OrderTimeFormComponent, DeliveryDataFormComponent, PaymentDataFormComponent]
})
export class OrderDetailsFormComponent {
  readonly timeOfOrderControl = input.required<FormControl<string | null>>();
  readonly timeOfDeliveryControl = input<FormControl<string | null>>();
  readonly deliveryDataForm = input.required<FormGroup<DeliveryDataForm>>();
  readonly paymentDataForm = input.required<FormGroup<PaymentDataForm>>();
  readonly paymentHint = input<string>("How people can pay you back");
}
