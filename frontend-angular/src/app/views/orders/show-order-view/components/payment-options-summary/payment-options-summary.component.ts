import {Component, Input} from '@angular/core';
import {PaymentData, ShowOrderResponse} from "../../../../../../frontend-client";
import {faCheck, faTimes} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-payment-options-summary',
  templateUrl: './payment-options-summary.component.html',
  styleUrls: ['./payment-options-summary.component.scss']
})
export class PaymentOptionsSummaryComponent {

  @Input() showOrderResponse!: ShowOrderResponse

  faCheck = faCheck
  faTimes = faTimes

  get paymentData() {
    return this.showOrderResponse.order.paymentData
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

}
