import {Component, input} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

export interface PaymentDataForm {
  paymentByCash: FormControl<boolean>,
  paymentByBankTransfer: FormControl<boolean>,
  bankTransferNumber: FormControl<string>,
  paymentByBlik: FormControl<boolean>,
  blikPhoneNumber: FormControl<string>,
}

@Component({
    selector: 'app-payment-data-form',
    templateUrl: './payment-data-form.component.html',
    styleUrls: ['./payment-data-form.component.scss'],
    standalone: true,
    imports: [MatSlideToggleModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule]
})
export class PaymentDataFormComponent {
  readonly paymentDataForm = input.required<FormGroup<PaymentDataForm>>();

}
