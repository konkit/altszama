import {DeliveryData, ParticipantsOrderEntry} from "../../../../../frontend-client";

export interface ShowOrderViewState {
  canShowPlaceOrderButton: boolean
  isPlaceOrderButtonDisabled: boolean
  canShowMarkAsDeliveredButton: boolean
  shouldDisplayNewOrderEntryCard: boolean
  isOrderOwner: boolean,
  allEatingPeopleCount: number,
  numberOfCurrentUserEntries: number,
  username: string,
  yourOrderEntries: ParticipantsOrderEntry[],
  priceSummaryData: PriceSummaryData;
  paymentOptionsData: PaymentOptionsData;
  shouldShowOrderLockedWarning: boolean;
}

export interface ModifyOrderEntryState {
  loadingEntry: boolean;

  orderEntryId: string;
  dishEntryId: string;

  isEntryCreating: boolean;
  isEntryEdited: boolean;
}

export interface PriceSummaryData {
  deliveryData: DeliveryData,
  basePriceSum: number,
  totalPrice: number,
  allEatingPeopleCount: number,
}

export interface PaymentOptionsData {
  shouldShowQRCodeButton: boolean,
}
