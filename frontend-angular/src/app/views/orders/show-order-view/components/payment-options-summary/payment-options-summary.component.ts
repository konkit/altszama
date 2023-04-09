import {Component, Input, OnInit} from '@angular/core';
import {PaymentData, ShowOrderResponse} from "../../../../../../frontend-client";
import {MatDialog} from "@angular/material/dialog";
import {
  BankTransferQrcodeModal,
  QrcodeModalInput
} from "./bank-transfer-qrcode-modal/bank-transfer-qrcode-modal.component";
import {ShowOrderViewState} from "../../lib/model";

@Component({
  selector: 'app-payment-options-summary',
  templateUrl: './payment-options-summary.component.html',
  styleUrls: ['./payment-options-summary.component.scss']
})
export class PaymentOptionsSummaryComponent implements OnInit {

  @Input() showOrderResponse!: ShowOrderResponse
  @Input() paymentData!: PaymentData
  @Input() viewState!: ShowOrderViewState

  shouldShowQRCodeButton: any;

  constructor(private dialog: MatDialog) {
  }

  ngOnInit() {
    this.shouldShowQRCodeButton = this.viewState.shouldShowQRCodeButton
  }


  formatBankAccountNr(unformattedInput: string) {
    if (unformattedInput) {
      const input = unformattedInput.trim();

      if (input.length === 26) {
        let result = input.slice(0, 2) + " ";

        for (let i = 2; i < input.length; i += 4) {
          result += input.slice(i, i + 4) + " ";
        }

        return result;
      }
    }

    return unformattedInput;
  }

  formatBlikPhoneNumber(unformattedInput: string) {
    if (unformattedInput) {
      const input = unformattedInput.trim();

      if (input.length >= 9) {
        return `${input.slice(0, input.length - 6)} ${input.slice(
          input.length - 6,
          input.length - 3
        )} ${input.slice(input.length - 3, input.length)}`;
      }
    }

    return unformattedInput;
  }

  showQrModal() {
    let data: QrcodeModalInput = {
      paymentData: this.showOrderResponse.order.paymentData,
      yourOrderEntries: this.viewState.yourOrderEntries,
      orderCreatorUsername: this.showOrderResponse.order.orderCreatorUsername,
      orderDate: this.showOrderResponse.order.orderDate
    }
    this.dialog.open(BankTransferQrcodeModal, { width: '300px', data: data })
  }
}
