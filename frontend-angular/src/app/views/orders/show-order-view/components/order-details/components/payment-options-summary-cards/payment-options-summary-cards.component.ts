import {Component, Input} from '@angular/core';
import {ParticipantsOrderEntry, PaymentData} from "../../../../../../../../frontend-client";
import {PaymentOptionsData} from "../../../../../lib/model";
import {ShowOrderViewService} from "../../../../service/show-order-view.service";
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {NgIf} from '@angular/common';
import {MatCardModule} from '@angular/material/card';

@Component({
    selector: 'app-payment-options-summary-cards',
    templateUrl: './payment-options-summary-cards.component.html',
    styleUrl: './payment-options-summary-cards.component.scss',
    standalone: true,
    imports: [MatCardModule, NgIf, MatListModule, MatIconModule, MatTooltipModule]
})
export class PaymentOptionsSummaryCardsComponent {
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
