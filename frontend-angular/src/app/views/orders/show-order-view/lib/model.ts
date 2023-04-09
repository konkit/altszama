import {ParticipantsOrderEntry} from "../../../../../frontend-client";
import {PriceSummaryInput} from "../components/price-summary/price-summary.component";

export interface ShowOrderViewState {
  canShowPlaceOrderButton: boolean
  isPlaceOrderButtonDisabled: boolean
  canShowMarkAsDeliveredButton: boolean
  shouldDisplayNewOrderEntryCard: boolean
  shouldShowQRCodeButton: boolean,
  isOrderOwner: boolean,
  allEatingPeopleCount: number,
  numberOfCurrentUserEntries: number,
  username: string,
  yourOrderEntries: ParticipantsOrderEntry[],
  priceSummaryInput: PriceSummaryInput;
  shouldShowOrderLockedWarning: boolean;
}

export interface ModifyOrderEntryState {
  loadingEntry: boolean;

  orderEntryId: string;
  dishEntryId: string;

  isEntryCreating: boolean;
  isEntryEdited: boolean;
}
