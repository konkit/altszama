export interface IndexResponse {
  restaurants: RestaurantInfo[];
}

export interface RestaurantInfo {
  id: string,
  name: string,
  lastCrawled: number,
  lastEdited: number,
  dishCount: number,
}

export interface ShowResponse {
  restaurant: Restaurant,
  dishes: DishDto[],
  dishesByCategory: Map<String, DishDto[]>
}

export interface Restaurant {
  id: string,
  name: string,
  telephone: string,
  address: string,
  url: string,
  lastCrawled?: number,
  lastEdited?: number,
}

export interface RestaurantSaveRequest {
  name: string,
  telephone: string,
  address: string,
  url: string,
}

export interface EditRestaurantResponse {
  id: string,
  name: string,
  address: string,
  telephone: string,
  url: string
}

export interface RestaurantUpdateRequest {
  id: string,
  name: string,
  telephone: string
  address: string,
  url: string,
}

export interface DishDto {
  id: string,
  name: string,
  price: number,
  sideDishes: SideDish[],
  category: string,
  lastCrawled?: number,
}

export interface DishCreateResponse {
  categories: string[]
}

export interface DishCreateRequest {
  name: string,
  price: number,
  sideDishes: SideDish[],
  category: string,
}

export interface SideDish {
  id: string,
  name: string,
  price: Int,
}

export interface EditDishResponse {
  dish: DishDto,
  categories: string[]
}

export interface DishUpdateRequest {
  id: string,
  name: string,
  price: Int,
  sideDishes: SideDish[],
  category: string
}

export enum OrderState {
  CREATED = "CREATED",
  ORDERING = "ORDERING",
  ORDERED = "ORDERED",
  DELIVERED = "DELIVERED",
  REJECTED = "REJECTED",
}

export interface OrderDto {
  id: string,
  restaurantName: string,
  orderCreatorUsername: string,
  orderDate: number,
  orderState: OrderState
}

export interface CreateOrderResponse {
  restaurantsList: Restaurant[],
  orderDate: string,
  timeOfOrder: string,
  bankTransferNumber: string
  blikPhoneNumber: string
}

export interface CreateOrderData {
  restaurantsList: Restaurant[],
  order: OrderSaveRequest
}

export interface OrderSaveRequest {
  restaurantId: string,
  orderDate: string,
  timeOfOrder: number,
  decreaseInPercent: number,
  deliveryCostPerEverybody: number,
  deliveryCostPerDish: number,
  paymentByCash: boolean,
  paymentByBankTransfer: boolean,
  bankTransferNumber: string,
  paymentByBlik: boolean,
  blikPhoneNumber: string
}

export interface OrderUpdateRequest {
  orderId: string,
  orderDate: string,
  timeOfOrder: number,
  decreaseInPercent: number,
  deliveryCostPerEverybody: number,
  deliveryCostPerDish: number,
  paymentByCash: boolean,
  paymentByBankTransfer: boolean,
  bankTransferNumber: string,
  paymentByBlik: boolean,
  blikPhoneNumber: string,
}

export interface OrderEntryDto {
  id: string,
  orderId: string,
  orderState: OrderState,
  dishEntries: DishEntryDto[]
  paymentStatus: OrderEntryPaymentStatus
  created: number
}

export interface DishEntryDto {
  restaurantName: string,
  dish: DishDto,
  chosenSideDishes: SideDish[]
  additionalComments: String
  id: String
}

export interface TodayOrdersResponse {
  ordersList: OrderDto[],
  currentOrderEntries: OrderEntryDto[]
}

export interface OrderViewResponse {
  orderState: OrderState,
  orderDecreaseInPercent: number,
  orderDeliveryCostPerEverybody: number,
  orderDeliveryCostPerDish: number,
  restaurantName: string,
  restaurantTelephone: string,
  groupedEntries: GroupedOrderEntry[],
  allEatingPeopleCount: number,
  basePriceSum: number,
  totalPrice: number
}

export interface GroupedOrderEntry {
  dish: DishDto,
  price: number,
  eatingPeopleCount: number,
  eatingPeopleEntries: EatingPersonEntry[]
}

export interface EatingPersonEntry {
  username: string,
  comments: string,
  sideDishes: SideDish[]
}
