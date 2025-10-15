import { Component, input, OnDestroy, OnInit } from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { Subscription } from 'rxjs';

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
export class PaymentDataFormComponent implements OnInit, OnDestroy {
  readonly paymentDataForm = input.required<FormGroup<PaymentDataForm>>();

  subscriptions = new Subscription();

  ngOnInit() {

    if (this.paymentDataForm().controls.paymentByBlik.value) {
      this.paymentDataForm().controls.blikPhoneNumber.enable()
    } else {
      this.paymentDataForm().controls.blikPhoneNumber.disable()
    }

    if (this.paymentDataForm().controls.paymentByBankTransfer.value) {
      this.paymentDataForm().controls.bankTransferNumber.enable()
    } else {
      this.paymentDataForm().controls.bankTransferNumber.disable()
    }

    const sub1 = this.paymentDataForm().controls.paymentByBlik.valueChanges.subscribe(value => {
      if (value) {
        this.paymentDataForm().controls.blikPhoneNumber.enable()
      } else {
        this.paymentDataForm().controls.blikPhoneNumber.disable()
      }
    })
    this.subscriptions.add(sub1)

    const sub2 = this.paymentDataForm().controls.paymentByBankTransfer.valueChanges.subscribe(value => {
      if (value) {
        this.paymentDataForm().controls.bankTransferNumber.enable()
      } else {
        this.paymentDataForm().controls.bankTransferNumber.disable()
      }
    })
    this.subscriptions.add(sub2)
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe()
  }

}
