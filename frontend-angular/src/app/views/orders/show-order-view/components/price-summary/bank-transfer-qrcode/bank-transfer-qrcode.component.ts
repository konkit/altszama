import {Component, Input} from '@angular/core';
import {ParticipantsOrderEntry, ShowOrderDto, ShowOrderResponse} from "../../../../../../../frontend-client";
import OrderStateEnum = ShowOrderDto.OrderStateEnum;

@Component({
  selector: 'app-bank-transfer-qrcode',
  templateUrl: './bank-transfer-qrcode.component.html',
  styleUrls: ['./bank-transfer-qrcode.component.scss']
})
export class BankTransferQRCodeComponent {

  @Input() showOrderResponse!: ShowOrderResponse

  dialog = false

  get order() {
    return this.showOrderResponse.order;
  }

  get orderEntry(): ParticipantsOrderEntry | undefined {
    return this.showOrderResponse.orderEntries.find(e => e.userId === this.currentUserId);
  }

  get currentUserId(): string {
    return this.showOrderResponse.currentUserId;
  }

  shouldShowQRCodeButton() {
    return this.isAnyOrderEntryOwner() && this.isOrderedOrDelivered() && this.order.paymentData.paymentByBankTransfer;
  }

  userOrderAmount() {
    return this.orderEntry?.finalPrice
  }

  generateCodeValue() {
    const bankAccountNumber = this.formatBankTransferNumber(this.order.paymentData.bankTransferNumber);
    const amount = this.userOrderAmount();
    const orderCreator = this.formatName(this.order.orderCreatorUsername);
    const transferTitle = `AltSzama ${this.order.orderDate}`;

    return `||${bankAccountNumber}|${amount}|${orderCreator}|${transferTitle}||ALTSZAMA|PLN`;
  }

  private isAnyOrderEntryOwner() {
    return this.orderEntry != null;
  }

  private isOrderedOrDelivered() {
    return [OrderStateEnum.ORDERED, OrderStateEnum.DELIVERED].includes(this.order.orderState);
  }

  private formatName(inputValue: string) {
    return inputValue
      .replace(/ą/g, "a")
      .replace(/Ą/g, "A")
      .replace(/ć/g, "c")
      .replace(/Ć/g, "C")
      .replace(/ę/g, "e")
      .replace(/Ę/g, "E")
      .replace(/ł/g, "l")
      .replace(/Ł/g, "L")
      .replace(/ń/g, "n")
      .replace(/Ń/g, "N")
      .replace(/ó/g, "o")
      .replace(/Ó/g, "O")
      .replace(/ś/g, "s")
      .replace(/Ś/g, "S")
      .replace(/ż/g, "z")
      .replace(/Ż/g, "Z")
      .replace(/ź/g, "z")
      .replace(/Ź/g, "Z")
      .toUpperCase();
  }

  private formatBankTransferNumber(inputValue: string) {
    return inputValue.replace(/ /g, "");
  }
}
