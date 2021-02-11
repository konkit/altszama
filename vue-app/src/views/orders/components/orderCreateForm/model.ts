export interface PriceModifierFieldsValue {
  decreaseInPercent: number;
  deliveryCostPerEverybody: number;
  deliveryCostPerDish: number;
}

export interface PaymentDataFieldsValue {
  paymentByCash: boolean,
  paymentByBankTransfer: boolean,
  bankTransferNumber: string,
  paymentByBlik: boolean,
  blikPhoneNumber: string
}
