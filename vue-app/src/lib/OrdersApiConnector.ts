import router from '../router/index'
import store, {RootState} from "@/store";
import {
  AllOrdersResponse,
  Configuration,
  CreateOrderResponse,
  OrderControllerApi,
  OrderEntryControllerApi,
  OrderEntrySaveRequest,
  OrderEntryUpdateRequest,
  OrderSaveRequest,
  OrderUpdateRequest,
  OrderViewResponse,
  SetAsOrderedResponse,
  ShowOrderResponse
} from "@/frontend-client";
import LocalConfiguration from "./LocalConfiguration"

function headersWithToken() {
  return { headers: {'Authorization': 'Bearer ' + store.state.token } }
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
    this.orderEntryApi = new OrderEntryControllerApi((this.configuration));
  }

  saveOrderEntry (orderId: string, editedOrderEntry) {
    let formData: OrderEntrySaveRequest = {
      orderId: orderId,
      dishId: editedOrderEntry.dishId,
      newDish: editedOrderEntry.newDish,
      newDishName: editedOrderEntry.newDishName,
      newDishPrice: editedOrderEntry.newDishPrice,
      additionalComments: editedOrderEntry.additionalComments,
      sideDishes: editedOrderEntry.chosenSideDishes.map(sd => Object.assign(sd, {newSideDishPrice: sd.newSideDishPrice}))
    };

    return this.orderEntryApi.save1(formData, headersWithToken());
  }

  updateOrderEntry (orderId: string, orderEntryId: string, editedOrderEntry) {
    let formData: OrderEntryUpdateRequest = {
      id: orderEntryId,
      orderId: orderId,
      dishEntryId: editedOrderEntry.dishEntryId,
      dishId: editedOrderEntry.dishId,
      newDish: editedOrderEntry.newDish,
      newDishName: editedOrderEntry.newDishName,
      newDishPrice: editedOrderEntry.newDishPrice,
      additionalComments: editedOrderEntry.additionalComments,
      sideDishes: editedOrderEntry.chosenSideDishes.map(sd => Object.assign({}, sd, {newSideDishPrice: sd.newSideDishPrice}))
    };

    // return ApiConnector.makePost(action, formData)
    return this.orderEntryApi.update1(formData, headersWithToken())
  }

  deleteDishEntry (orderEntryId: string, dishEntryId: string) {
    // return ApiConnector.makeGet('/order_entries/' + orderEntryId + '/dish_entry/' + dishEntryId + '/delete')
    return this.orderEntryApi.delete1(orderEntryId, dishEntryId, headersWithToken())
  }

  fetchOrder (orderId: string): Promise<ShowOrderResponse> {
    return this.orderApi.show(orderId, headersWithToken())
  }

  fetchAllOrders (): Promise<AllOrdersResponse> {
    return this.orderApi.allOrders(headersWithToken())
  }

  fetchTodaysOrders () {
    return this.orderApi.todayOrders(headersWithToken())
  }

  fetchOrderView (orderId: string): Promise<OrderViewResponse> {
    return this.orderApi.orderViewJson(orderId, headersWithToken())
  }

  getOrderCreateData () {
    const createResponse: Promise<CreateOrderResponse> = this.orderApi.create(headersWithToken());

    return createResponse
        .then(response => {
          let restaurantId;
          if( response.restaurant != null) {
            restaurantId = response.restaurant.id
          } else if (response.restaurantsList.length > 0) {
            restaurantId = response.restaurantsList[0].id;
          }

          let bankTransferNumber = "";
          let paymentByBankTransfer = false;
          if (response.bankTransferNumber) {
            paymentByBankTransfer = true;
            bankTransferNumber = response.bankTransferNumber;
          }

          let blikPhoneNumber = "";
          let paymentByBlik = false;
          if (response.blikPhoneNumber) {
            paymentByBlik = true;
            blikPhoneNumber = response.blikPhoneNumber;
          }

          return {
            restaurantsList: response.restaurantsList,
            order: {
              restaurantId: restaurantId,
              orderDate: response.orderDate,
              timeOfOrder: response.timeOfOrder,

              decreaseInPercent: 0,
              deliveryCostPerEverybody: 0,
              deliveryCostPerDish: 0,
              paymentByCash: true,
              paymentByBankTransfer: paymentByBankTransfer,
              bankTransferNumber: bankTransferNumber,
              paymentByBlik: paymentByBlik,
              blikPhoneNumber: blikPhoneNumber
            }
          }
        });
  }

  getOrderEditData (orderId: string) {
    return this.orderApi.edit(orderId, headersWithToken())
  }

  setOrderAsCreated (orderId: string) {
    return this.orderApi.setAsCreated(orderId, headersWithToken());
  }

  setOrderAsOrdered (orderId: string) {
    return this.orderApi.setAsOrdered(orderId, headersWithToken())
  }

  setOrderAsDelivered (orderId: string) {
    return this.orderApi.setAsDelivered(orderId, headersWithToken())
  }

  setOrderAsRejected (orderId: string) {
    return this.orderApi.setAsRejected(orderId, headersWithToken());
  }

  deleteOrder (orderId: string) {
    return this.orderApi._delete(orderId, headersWithToken())
  }

  markOrderEntryAsPaid (orderEntryId: string) {
    return this.orderEntryApi.setAsMarkedAsPaid(orderEntryId, headersWithToken())
  }

  confirmOrderEntryAsPaid (orderEntryId: string) {
    return this.orderEntryApi.setAsConfirmedAsPaid(orderEntryId, headersWithToken())
  }

  createOrder (order: OrderSaveRequest) {
    return this.orderApi.save(order, headersWithToken())
  }

  editOrder (order: OrderUpdateRequest) {
    return this.orderApi.update(order, headersWithToken())
  }

  makeAnOrder (orderId: string, formData: SetAsOrderedResponse) {
    return this.orderApi.setAsOrdered1(formData, orderId, headersWithToken())
      .then(() => router.push("/orders/show/" + orderId));
  }
}