import {Component, Input} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";

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
  styleUrls: ['./payment-data-form.component.scss']
})
export class PaymentDataFormComponent {
  @Input() paymentDataForm!: FormGroup<PaymentDataForm>

}
