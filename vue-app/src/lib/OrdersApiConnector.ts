import router from "../router/index";
import store, {RootState} from "@/store";
import {
  AllOrdersResponse,
  Configuration,
  CreateOrderInitialData,
  EditOrderInitialData,
  OrderControllerApi,
  OrderEntryControllerApi,
  OrderEntrySaveRequest,
  OrderEntryUpdateRequest,
  OrderSaveRequest,
  OrderUpdateRequest,
  OrderViewInitialData,
  SetAsOrderedResponse,
  ShowOrderResponse,
  SideDishData
} from "@/frontend-client";
import LocalConfiguration from "./LocalConfiguration";

function headersWithToken() {
  return { headers: { Authorization: "Bearer " + store.state.token } };
}

export interface OrderEntryToModify {
  orderId: string;
  dishId: string;
  dishEntryId: string;
  additionalComments: string;
  newDish: boolean;
  newDishName: string;
  newDishPrice: number;
  chosenSideDishes: SideDishData[];
}

export default class OrdersApiConnector {
  private localConfiguration: LocalConfiguration;
  private configuration: Configuration;
  private readonly orderApi: OrderControllerApi;
  private readonly orderEntryApi: OrderEntryControllerApi;

  constructor(rootState: RootState) {
    this.localConfiguration = new LocalConfiguration(rootState);
    this.configuration = this.localConfiguration.createConfiguration();
    this.orderApi = new OrderControllerApi(this.configuration);
    this.orderEntryApi = new OrderEntryControllerApi(this.configuration);
  }

  saveOrderEntry(orderId: string, editedOrderEntry: OrderEntryToModify) {
    const formData: OrderEntrySaveRequest = {
      orderId: orderId,
      dishId: editedOrderEntry.dishId,
      newDish: editedOrderEntry.newDish,
      newDishName: editedOrderEntry.newDishName,
      newDishPrice: editedOrderEntry.newDishPrice,
      additionalComments: editedOrderEntry.additionalComments,
      sideDishes: editedOrderEntry.chosenSideDishes.map(sd =>
        Object.assign(sd, { newSideDishPrice: sd.newSideDishPrice })
      )
    };

    return this.orderEntryApi.save1(formData, headersWithToken());
  }

  updateOrderEntry(
    orderId: string,
    orderEntryId: string,
    editedOrderEntry: OrderEntryToModify
  ) {
    const formData: OrderEntryUpdateRequest = {
      id: orderEntryId,
      orderId: orderId,
      dishEntryId: editedOrderEntry.dishEntryId,
      dishId: editedOrderEntry.dishId,
      newDish: editedOrderEntry.newDish,
      newDishName: editedOrderEntry.newDishName,
      newDishPrice: editedOrderEntry.newDishPrice,
      additionalComments: editedOrderEntry.additionalComments,
      sideDishes: editedOrderEntry.chosenSideDishes.map(sd =>
        Object.assign({}, sd, { newSideDishPrice: sd.newSideDishPrice })
      )
    };

    return this.orderEntryApi.update1(formData, headersWithToken());
  }

  deleteDishEntry(orderEntryId: string, dishEntryId: string) {
    return this.orderEntryApi.delete1(
      orderEntryId,
      dishEntryId,
      headersWithToken()
    );
  }

  fetchOrder(orderId: string): Promise<ShowOrderResponse> {
    return this.orderApi.show(orderId, headersWithToken());
  }

  fetchAllOrders(): Promise<AllOrdersResponse> {
    return this.orderApi.allOrders(headersWithToken());
  }

  fetchTodaysOrders() {
    return this.orderApi.todayOrders(headersWithToken());
  }

  fetchOrderView(orderId: string): Promise<OrderViewInitialData> {
    return this.orderApi.orderViewJson(orderId, headersWithToken());
  }

  getOrderCreateData() {
    return this.orderApi.create(headersWithToken());
  }

  getOrderEditData(orderId: string): Promise<EditOrderInitialData> {
    return this.orderApi.edit(orderId, headersWithToken());
  }

  setOrderAsCreated(orderId: string) {
    return this.orderApi.setAsCreated(orderId, headersWithToken());
  }

  setOrderAsOrdered(orderId: string) {
    return this.orderApi.setBackAsOrdered(orderId, headersWithToken());
  }

  setOrderAsDelivered(orderId: string) {
    return this.orderApi.setAsDelivered(orderId, headersWithToken());
  }

  setOrderAsRejected(orderId: string) {
    return this.orderApi.setAsRejected(orderId, headersWithToken());
  }

  deleteOrder(orderId: string) {
    return this.orderApi._delete(orderId, headersWithToken());
  }

  markOrderEntryAsPaid(orderEntryId: string) {
    return this.orderEntryApi.setAsMarkedAsPaid(
      orderEntryId,
      headersWithToken()
    );
  }

  confirmOrderEntryAsPaid(orderEntryId: string) {
    return this.orderEntryApi.setAsConfirmedAsPaid(
      orderEntryId,
      headersWithToken()
    );
  }

  createOrder(order: OrderSaveRequest) {
    return this.orderApi.save(order, headersWithToken());
  }

  editOrder(order: OrderUpdateRequest) {
    return this.orderApi.update(order, headersWithToken());
  }

  makeAnOrder(orderId: string, formData: SetAsOrderedResponse) {
    return this.orderApi
      .setAsOrdered(formData, orderId, headersWithToken())
      .then(() => router.back());
  }
}
