import {Component, Input, OnInit} from '@angular/core';
import {ParticipantsOrderEntry, PaymentData} from "../../../../../../frontend-client";
import {PaymentOptionsData} from "../../lib/model";
import {ShowOrderViewService} from "../../service/show-order-view.service";

@Component({
  selector: 'app-payment-options-summary',
  templateUrl: './payment-options-summary.component.html',
  styleUrls: ['./payment-options-summary.component.scss']
})
export class PaymentOptionsSummaryComponent implements OnInit {

  @Input() paymentData!: PaymentData
  @Input() yourOrderEntries!: ParticipantsOrderEntry[]
  @Input() paymentOptionsData!: PaymentOptionsData

  shouldShowQRCodeButton: any;

  constructor(private showOrderViewService: ShowOrderViewService) {
  }

  ngOnInit() {
    this.shouldShowQRCodeButton = this.paymentOptionsData.shouldShowQRCodeButton
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
    this.showOrderViewService.showQrModal()
  }
}
