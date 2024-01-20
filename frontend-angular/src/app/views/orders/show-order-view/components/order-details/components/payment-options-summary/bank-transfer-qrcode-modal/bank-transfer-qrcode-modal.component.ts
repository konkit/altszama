import {Component, Inject} from '@angular/core';
import {ParticipantsOrderEntry, PaymentData} from "../../../../../../../../../frontend-client";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatButtonModule} from '@angular/material/button';
import {QRCodeModule} from 'angularx-qrcode';

export interface QrcodeModalInput {
  paymentData: PaymentData,
  yourOrderEntries: ParticipantsOrderEntry[],
  orderCreatorUsername: string,
  orderDate: string
}

@Component({
    selector: 'app-bank-transfer-qrcode-modal',
    templateUrl: './bank-transfer-qrcode-modal.component.html',
    styleUrls: ['./bank-transfer-qrcode-modal.component.scss'],
    standalone: true,
    imports: [MatDialogTitle, MatDialogContent, QRCodeModule, MatDialogActions, MatButtonModule]
})
export class BankTransferQrcodeModal {

  paymentData: PaymentData;
  yourOrderEntries: ParticipantsOrderEntry[];
  orderCreatorUsername: string;
  orderDate: string

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: QrcodeModalInput,
    private dialogRef: MatDialogRef<BankTransferQrcodeModal>
  ) {
    this.paymentData = data.paymentData;
    this.yourOrderEntries = data.yourOrderEntries;
    this.orderCreatorUsername = data.orderCreatorUsername;
    this.orderDate = data.orderDate;
  }

  generateCodeValue() {
    const bankAccountNumber = this.formatBankTransferNumber(this.paymentData.bankTransferNumber);
    const amount = this.yourOrderEntries.map(x => x.finalPrice).reduce((x, y) => x + y);
    const orderCreator = this.formatName(this.orderCreatorUsername);
    const transferTitle = `AltSzama ${this.orderDate}`;

    return `||${bankAccountNumber}|${amount}|${orderCreator}|${transferTitle}||ALTSZAMA|PLN`;
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

  closeModal() {
    this.dialogRef.close(true);
  }
}
