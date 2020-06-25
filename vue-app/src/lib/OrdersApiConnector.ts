import ApiConnector from "./ApiConnector";

import router from '../router/index'
import {DishDto, Restaurant, SideDish} from "@/lib/DishesApiConnector";
import {
  CreateOrderData,
  CreateOrderResponse,
  OrderDto,
  OrderSaveRequest, OrderUpdateRequest,
  OrderViewResponse,
  TodayOrdersResponse
} from "@/lib/model";

export default {

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
  },

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
  },

  deleteDishEntry (orderEntryId, dishEntryId) {
    return ApiConnector.makeGet('/order_entries/' + orderEntryId + '/dish_entry/' + dishEntryId + '/delete')
  },

  fetchOrder (orderId) {
    return ApiConnector.makeGet("/orders/" + orderId + "/show.json")
      .then(response => {
        return {
          order: response.data.order,
          orderEntries: response.data.orderEntries,
          currentUserId: response.data.currentUserId,
          allDishesInRestaurant: response.data.allDishesInRestaurant,
          allDishesByCategory: convertToMapEntries(response.data.allDishesByCategory),
          dishIdToSideDishesMap: response.data.dishIdToSideDishesMap,
          totalOrderPrice: response.data.totalOrderPrice,
          baseOrderPrice: response.data.baseOrderPrice
        };
      })
  },

  fetchAllOrders (): Promise<OrderDto[]> {
    return ApiConnector.makeGet("/orders/all.json")
      .then(response => {
          return response.data.allOrdersList;
      })
  },

  fetchTodaysOrders (): Promise<TodayOrdersResponse> {
    return ApiConnector.makeGet("/orders/today.json")
      .then(response => {
        return {
          currentOrderEntries: response.data.currentOrderEntries,
          ordersList: response.data.ordersList
        }
      })
  },

  fetchOrderView (orderId): Promise<OrderViewResponse> {
    return ApiConnector.makeGet("/orders/" + orderId + "/order_view.json")
        .then(response => {
          return {
            orderState: response.data.orderState,
            orderDecreaseInPercent: response.data.orderDecreaseInPercent,
            orderDeliveryCostPerEverybody: response.data.orderDeliveryCostPerEverybody,
            orderDeliveryCostPerDish: response.data.orderDeliveryCostPerDish,
            restaurantName: response.data.restaurantName,
            restaurantTelephone: response.data.restaurantTelephone,
            groupedEntries: response.data.groupedEntries,
            allEatingPeopleCount: response.data.allEatingPeopleCount,
            basePriceSum: response.data.basePriceSum,
            totalPrice: response.data.totalPrice
          }
        })
  },

  getOrderCreateData (): Promise<CreateOrderData> {
    const createResponse: Promise<CreateOrderResponse> = ApiConnector.makeGet("/orders/create.json")

    return createResponse
        .then(response => {
          let restaurantId;
          if( response.data.restaurant != null) {
            restaurantId = response.data.restaurant.id
          } else if (response.data.restaurantsList.length > 0) {
            restaurantId = response.data.restaurantsList[0].id;
          }

          let bankTransferNumber = "";
          let paymentByBankTransfer = false;
          if (response.data.bankTransferNumber) {
            paymentByBankTransfer = true;
            bankTransferNumber = response.data.bankTransferNumber;
          }

          let blikPhoneNumber = "";
          let paymentByBlik = false;
          if (response.data.blikPhoneNumber) {
            paymentByBlik = true;
            blikPhoneNumber = response.data.blikPhoneNumber;
          }

          return {
            restaurantsList: response.data.restaurantsList,
            order: {
              restaurantId: restaurantId,
              orderDate: response.data.orderDate,
              timeOfOrder: response.data.timeOfOrder,

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
  },

  getOrderEditData (orderId) {
    return ApiConnector.makeGet("/orders/" + orderId + "/edit.json")
        .then(response => {
          return {
            order: {
              restaurantId: response.data.order.restaurantId,
              restaurantName: response.data.order.restaurantName,
              orderDate: response.data.order.orderDate,
              timeOfOrder: response.data.order.timeOfOrder,
              decreaseInPercent: response.data.order.decreaseInPercent,
              deliveryCostPerEverybody: response.data.order.deliveryCostPerEverybody,
              deliveryCostPerDish: response.data.order.deliveryCostPerDish,
              paymentByCash: response.data.order.paymentByCash,
              paymentByBankTransfer: response.data.order.paymentByBankTransfer,
              bankTransferNumber: response.data.order.bankTransferNumber,
              paymentByBlik: response.data.order.paymentByBlik,
              blikPhoneNumber: response.data.order.blikPhoneNumber
            }
          }
        })
  },

  setOrderAsCreated (orderId) {
    return ApiConnector.makePost('/orders/' + orderId + '/set_as_created')
  },

  setOrderAsOrdered (orderId) {
    return ApiConnector.makePost('/orders/' + orderId + '/set_back_as_ordered')
  },

  setOrderAsDelivered (orderId) {
    return ApiConnector.makePost('/orders/' + orderId + '/set_as_delivered')
  },

  setOrderAsRejected (orderId) {
    return ApiConnector.makePost('/orders/' + orderId + '/set_as_rejected')
  },

  deleteOrder (orderId) {
    return ApiConnector.makeDelete('/orders/' + orderId + '/delete')
  },

  markOrderEntryAsPaid (orderEntryId) {
    return ApiConnector.makeGet('/order_entries/' + orderEntryId + '/mark_as_paid')
  },

  confirmOrderEntryAsPaid (orderEntryId) {
    return ApiConnector.makeGet('/order_entries/' + orderEntryId + '/confirm_as_paid')
  },

  createOrder (order: OrderSaveRequest) {
    let formData = {
      restaurantId: order.restaurantId,
      orderDate: order.orderDate,
      timeOfOrder: order.timeOfOrder,
      decreaseInPercent: order.decreaseInPercent,
      deliveryCostPerEverybody: order.deliveryCostPerEverybody,
      deliveryCostPerDish: order.deliveryCostPerDish,
      paymentByCash: order.paymentByCash === true,
      paymentByBankTransfer: order.paymentByBankTransfer === true,
      bankTransferNumber: order.bankTransferNumber,
      paymentByBlik: order.paymentByBlik === true,
      blikPhoneNumber: order.blikPhoneNumber
    };

    return ApiConnector.makePost("/orders/save", formData)
      .then(response => router.push("/orders/"))
  },

  editOrder (orderId, order: OrderUpdateRequest) {
    let formData = {
      orderId: orderId,
      restaurantId: order.restaurantId,
      orderDate: order.orderDate,
      timeOfOrder: order.timeOfOrder,
      decreaseInPercent: order.decreaseInPercent,
      deliveryCostPerEverybody: order.deliveryCostPerEverybody,
      deliveryCostPerDish: order.deliveryCostPerDish,
      paymentByCash: order.paymentByCash === true,
      paymentByBankTransfer: order.paymentByBankTransfer === true,
      bankTransferNumber: order.bankTransferNumber,
      paymentByBlik: order.paymentByBlik === true,
      blikPhoneNumber: order.blikPhoneNumber
    };

    return ApiConnector.makePost("/orders/update", formData)
      .then(response => router.push("/orders/show/" + orderId))
  },

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