import {DeliveryData, DishDto, ParticipantsOrderEntry, ShowOrderDto} from "../../../../frontend-client";

export interface ShowOrderViewState {
  order: ShowOrderDto,
  flags: ShowOrderViewStateFlags
  allDishesInRestaurant: DishDto[]
  allEatingPeopleCount: number
  currentUserId: string
  username: string
  yourOrderEntries: ParticipantsOrderEntry[]
  priceSummaryData: PriceSummaryData
  paymentOptionsData: PaymentOptionsData
}

export interface ShowOrderViewStateFlags {
  canShowPlaceOrderButton: boolean
  isPlaceOrderButtonDisabled: boolean
  canShowMarkAsDeliveredButton: boolean
  isOrderOwner: boolean
  shouldShowOrderLockedWarning: boolean
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
