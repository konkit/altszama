import {Component, computed, input} from '@angular/core';
import {Clipboard} from '@angular/cdk/clipboard';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {ShowOrderViewState} from "../../../lib/model";
import {ShowOrderViewService} from "../../service/show-order-view.service";
import {PricePipe} from "../../../../../components/pipes/price.pipe";
import {ShowOrderDto} from "../../../../../../frontend-client";
import OrderStateEnum = ShowOrderDto.OrderStateEnum;

@Component({
  selector: 'app-order-summary-panel',
  templateUrl: './order-summary-panel.component.html',
  styleUrls: ['./order-summary-panel.component.scss'],
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatButtonModule, MatTooltipModule, PricePipe]
})
export class OrderSummaryPanelComponent {
  readonly viewState = input.required<ShowOrderViewState>();

  readonly bankTransferNumber = computed(() => this.viewState().order.paymentData.bankTransferNumber?.trim() ?? "")
  readonly blikPhoneNumber = computed(() => this.viewState().order.paymentData.blikPhoneNumber?.trim() ?? "")

  readonly showPaidCounter = computed(() => {
    const vs = this.viewState()
    return vs.flags.isOrderOwner
      && [OrderStateEnum.Ordered, OrderStateEnum.Delivered].includes(vs.order.orderState)
      && vs.entriesCount > 0
  })

  readonly hasAnyPaymentMethod = computed(() => {
    const paymentData = this.viewState().order.paymentData
    return paymentData.paymentByCash || paymentData.paymentByBankTransfer || paymentData.paymentByBlik
  })

  constructor(private clipboard: Clipboard,
              private snackBar: MatSnackBar,
              private showOrderViewService: ShowOrderViewService) {
  }

  copy(value: string, label: string) {
    if (this.clipboard.copy(value)) {
      this.snackBar.open(`${label} copied`, undefined, {duration: 2000})
    }
  }

  showQrModal() {
    this.showOrderViewService.showQrModal()
  }

  formatBankAccountNr(input: string) {
    if (input.length === 26) {
      let result = input.slice(0, 2);

      for (let i = 2; i < input.length; i += 4) {
        result += " " + input.slice(i, i + 4);
      }

      return result;
    }

    return input;
  }

  formatBlikPhoneNumber(input: string) {
    if (input.length >= 9) {
      return `${input.slice(0, input.length - 6)} ${input.slice(
        input.length - 6,
        input.length - 3
      )} ${input.slice(input.length - 3, input.length)}`;
    }

    return input;
  }
}
