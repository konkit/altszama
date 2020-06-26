import ApiConnector from "./ApiConnector";

import router from '../router/index'
import store from "@/store";
import {
  AllOrdersResponse,
  Configuration,
  CreateOrderResponse,
  OrderControllerApi,
  OrderSaveRequest,
  OrderUpdateRequest,
  OrderViewResponse,
  ShowOrderResponse
} from "@/frontend-client";

function headersWithToken() {
  return { headers: {'Authorization': 'Bearer ' + store.state.token } }
}

export default class OrdersApiConnector {

  private createConfiguration() {
    const currentDomain = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
    const backendUrl = process.env.VUE_APP_BACKEND_URL2 || currentDomain;

    return new Configuration({
      basePath: backendUrl,
      accessToken: store.state.token || ""
    });
  }

  private createOrderApi() {
    return new OrderControllerApi(this.createConfiguration());
  }

  saveOrderEntry (orderId, editedOrderEntry) {
    const action = "/order_entries/save";

    let formData = {
      orderId: orderId,
      dishId: editedOrderEntry.dishId,
      newDish: editedOrderEntry.newDish,
      newDishName: editedOrderEntry.newDishName,
      newDishPrice: editedOrderEntry.newDishPrice,
      additionalComments: editedOrderEntry.additionalComments,
      sideDishes: editedOrderEntry.chosenSideDishes.map(sd => Object.assign(sd, {newSideDishPrice: sd.newSideDishPrice}))
    };

    return ApiConnector.makePost(action, formData)

  }

  updateOrderEntry (orderId, orderEntryId, editedOrderEntry) {
    const action = "/order_entries/update";

    let formData = {
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

    return ApiConnector.makePost(action, formData)
  }

  deleteDishEntry (orderEntryId, dishEntryId) {
    return ApiConnector.makeGet('/order_entries/' + orderEntryId + '/dish_entry/' + dishEntryId + '/delete')
  }

  fetchOrder (orderId: string): Promise<ShowOrderResponse> {
    // return ApiConnector.makeGet("/orders/" + orderId + "/show.json")
    //   .then(response => {
    //     return {
    //       order: response.data.order,
    //       orderEntries: response.data.orderEntries,
    //       currentUserId: response.data.currentUserId,
    //       allDishesInRestaurant: response.data.allDishesInRestaurant,
    //       allDishesByCategory: convertToMapEntries(response.data.allDishesByCategory),
    //       dishIdToSideDishesMap: response.data.dishIdToSideDishesMap,
    //       totalOrderPrice: response.data.totalOrderPrice,
    //       baseOrderPrice: response.data.baseOrderPrice
    //     };
    //   })

    return this.createOrderApi().show(orderId, headersWithToken())
  }

  fetchAllOrders (): Promise<AllOrdersResponse> {
    // return ApiConnector.makeGet("/orders/all.json")
    //   .then(response => {
    //       return response.data.allOrdersList;
    //   })

    return this.createOrderApi().allOrders(headersWithToken())
  }

  fetchTodaysOrders () {
    // return ApiConnector.makeGet("/orders/today.json")
    //   .then(response => {
    //     return {
    //       currentOrderEntries: response.data.currentOrderEntries,
    //       ordersList: response.data.ordersList
    //     }
    //   })

    return this.createOrderApi().todayOrders(headersWithToken())
  }

  fetchOrderView (orderId): Promise<OrderViewResponse> {
    // return ApiConnector.makeGet("/orders/" + orderId + "/order_view.json")
    //     .then(response => {
    //       return {
    //         orderState: response.data.orderState,
    //         orderDecreaseInPercent: response.data.orderDecreaseInPercent,
    //         orderDeliveryCostPerEverybody: response.data.orderDeliveryCostPerEverybody,
    //         orderDeliveryCostPerDish: response.data.orderDeliveryCostPerDish,
    //         restaurantName: response.data.restaurantName,
    //         restaurantTelephone: response.data.restaurantTelephone,
    //         groupedEntries: response.data.groupedEntries,
    //         allEatingPeopleCount: response.data.allEatingPeopleCount,
    //         basePriceSum: response.data.basePriceSum,
    //         totalPrice: response.data.totalPrice
    //       }
    //     })

    return this.createOrderApi().orderViewJson(orderId, headersWithToken())
  }

  getOrderCreateData () {
    const createResponse: Promise<CreateOrderResponse> = this.createOrderApi().create(headersWithToken());

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

  getOrderEditData (orderId) {
    // return ApiConnector.makeGet("/orders/" + orderId + "/edit.json")
    //     .then(response => {
    //       return {
    //         order: {
    //           restaurantId: response.data.order.restaurantId,
    //           restaurantName: response.data.order.restaurantName,
    //           orderDate: response.data.order.orderDate,
    //           timeOfOrder: response.data.order.timeOfOrder,
    //           decreaseInPercent: response.data.order.decreaseInPercent,
    //           deliveryCostPerEverybody: response.data.order.deliveryCostPerEverybody,
    //           deliveryCostPerDish: response.data.order.deliveryCostPerDish,
    //           paymentByCash: response.data.order.paymentByCash,
    //           paymentByBankTransfer: response.data.order.paymentByBankTransfer,
    //           bankTransferNumber: response.data.order.bankTransferNumber,
    //           paymentByBlik: response.data.order.paymentByBlik,
    //           blikPhoneNumber: response.data.order.blikPhoneNumber
    //         }
    //       }
    //     })

    return this.createOrderApi().edit(orderId, headersWithToken())
  }

  setOrderAsCreated (orderId) {
    return ApiConnector.makePost('/orders/' + orderId + '/set_as_created')
  }

  setOrderAsOrdered (orderId) {
    return ApiConnector.makePost('/orders/' + orderId + '/set_back_as_ordered')
  }

  setOrderAsDelivered (orderId) {
    return ApiConnector.makePost('/orders/' + orderId + '/set_as_delivered')
  }

  setOrderAsRejected (orderId) {
    return ApiConnector.makePost('/orders/' + orderId + '/set_as_rejected')
  }

  deleteOrder (orderId) {
    return ApiConnector.makeDelete('/orders/' + orderId + '/delete')
  }

  markOrderEntryAsPaid (orderEntryId) {
    return ApiConnector.makeGet('/order_entries/' + orderEntryId + '/mark_as_paid')
  }

  confirmOrderEntryAsPaid (orderEntryId) {
    return ApiConnector.makeGet('/order_entries/' + orderEntryId + '/confirm_as_paid')
  }

  createOrder (order: OrderSaveRequest) {
    // let formData = {
    //   restaurantId: order.restaurantId,
    //   orderDate: order.orderDate,
    //   timeOfOrder: order.timeOfOrder,
    //   decreaseInPercent: order.decreaseInPercent,
    //   deliveryCostPerEverybody: order.deliveryCostPerEverybody,
    //   deliveryCostPerDish: order.deliveryCostPerDish,
    //   paymentByCash: order.paymentByCash === true,
    //   paymentByBankTransfer: order.paymentByBankTransfer === true,
    //   bankTransferNumber: order.bankTransferNumber,
    //   paymentByBlik: order.paymentByBlik === true,
    //   blikPhoneNumber: order.blikPhoneNumber
    // };
    //
    // return ApiConnector.makePost("/orders/save", formData)
    //   .then(response => router.push("/orders/"))

    return this.createOrderApi().save(order, headersWithToken())
  }

  editOrder (order: OrderUpdateRequest) {
    // let formData = {
    //   orderId: orderId,
    //   restaurantId: order.restaurantId,
    //   orderDate: order.orderDate,
    //   timeOfOrder: order.timeOfOrder,
    //   decreaseInPercent: order.decreaseInPercent,
    //   deliveryCostPerEverybody: order.deliveryCostPerEverybody,
    //   deliveryCostPerDish: order.deliveryCostPerDish,
    //   paymentByCash: order.paymentByCash === true,
    //   paymentByBankTransfer: order.paymentByBankTransfer === true,
    //   bankTransferNumber: order.bankTransferNumber,
    //   paymentByBlik: order.paymentByBlik === true,
    //   blikPhoneNumber: order.blikPhoneNumber
    // };
    //
    // return ApiConnector.makePost("/orders/update", formData)
    //   .then(response => router.push("/orders/show/" + orderId))

    return this.createOrderApi().update(order)
  }

  makeAnOrder (orderId, {approxTimeOfDelivery}) {
    let action = '/orders/' + orderId + '/set_as_ordered';

    let formData = {
      approxTimeOfDelivery: approxTimeOfDelivery.toString()
    };

    return ApiConnector.makePost(action, formData)
        .then(response => router.push("/orders/show/" + orderId))
  }
}

function convertToMapEntries(dishesMap) {
  let result = [];

  for (const key of Object.keys(dishesMap)) {
    result.push({"category": key, "dishes": dishesMap[key]})
  }

  return result;
}