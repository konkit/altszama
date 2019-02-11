import ApiConnector from "./ApiConnector";

import router from '../router/index'

export default {

  saveOrderEntry (orderId, editedOrderEntry) {
    const action = "/order_entries/save";

    let formData = {
      orderId: orderId,
      dishId: editedOrderEntry.dishId,
      newDish: editedOrderEntry.newDish,
      newDishName: editedOrderEntry.newDishName,
      newDishPrice: Math.round(editedOrderEntry.newDishPrice * 100),
      additionalComments: editedOrderEntry.additionalComments,
      sideDishes: editedOrderEntry.chosenSideDishes.map(sd => Object.assign(sd, {newSideDishPrice: Math.round(sd.newSideDishPrice * 100)}))
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
      newDishPrice: Math.round(editedOrderEntry.newDishPrice * 100),
      additionalComments: editedOrderEntry.additionalComments,
      sideDishes: editedOrderEntry.chosenSideDishes.map(sd => Object.assign({}, sd, {newSideDishPrice: Math.round(sd.newSideDishPrice * 100)}))
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

  fetchAllOrders () {
    return ApiConnector.makeGet("/orders/all.json")
      .then(response => {
          return response.data.allOrdersList;
      })
  },

  fetchTodaysOrders () {
    return ApiConnector.makeGet("/orders/today.json")
      .then(response => {
        return {
          currentOrderEntries: response.data.currentOrderEntries,
          createdOrders: response.data.createdOrders,
          orderingOrders: response.data.orderingOrders,
          orderedOrders: response.data.orderedOrders,
          deliveredOrders: response.data.deliveredOrders
        }
      })
  },

  fetchOrderView (orderId) {
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

  getOrderCreateData () {
    return ApiConnector.makeGet("/orders/create.json")
        .then(response => {
          let restaurantId;
          if( response.data.restaurant != null) {
            restaurantId = response.data.restaurant.id
          } else {
            restaurantId = response.data.restaurantsList[0].id;
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
              paymentByBankTransfer: false,
              bankTransferNumber: ''
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
              bankTransferNumber: response.data.order.bankTransferNumber
            }
          }
        })
  },

  setOrderAsCreated (orderId) {
    return ApiConnector.makeGet('/orders/' + orderId + '/set_as_created')
  },

  setOrderAsOrdered (orderId) {
    return ApiConnector.makeGet('/orders/' + orderId + '/set_back_as_ordered')
  },

  setOrderAsDelivered (orderId) {
    return ApiConnector.makeGet('/orders/' + orderId + '/set_as_delivered')
  },

  setOrderAsRejected (orderId) {
    return ApiConnector.makeGet('/orders/' + orderId + '/set_as_rejected')
  },

  deleteOrder (orderId) {
    return ApiConnector.makeGet('/orders/' + orderId + '/delete')
  },

  markOrderEntryAsPaid (orderEntryId) {
    return ApiConnector.makeGet('/order_entries/' + orderEntryId + '/mark_as_paid')
  },

  confirmOrderEntryAsPaid (orderEntryId) {
    return ApiConnector.makeGet('/order_entries/' + orderEntryId + '/confirm_as_paid')
  },

  createOrder (order) {
    let formData = {
      restaurantId: order.restaurantId,
      orderDate: order.orderDate,
      timeOfOrder: order.timeOfOrder,
      decreaseInPercent: order.decreaseInPercent,
      deliveryCostPerEverybody: Math.round(order.deliveryCostPerEverybody * 100),
      deliveryCostPerDish: Math.round(order.deliveryCostPerDish * 100),
      paymentByCash: order.paymentByCash === true,
      paymentByBankTransfer: order.paymentByBankTransfer === true,
      bankTransferNumber: order.bankTransferNumber
    };

    return ApiConnector.makePost("/orders/save", formData)
      .then(response => router.push("/orders/"))
  },

  editOrder (orderId, order) {
    let formData = {
      orderId: orderId,
      restaurantId: order.restaurantId,
      orderDate: order.orderDate,
      timeOfOrder: order.timeOfOrder,
      decreaseInPercent: order.decreaseInPercent,
      deliveryCostPerEverybody: Math.round(order.deliveryCostPerEverybody),
      deliveryCostPerDish: Math.round(order.deliveryCostPerDish),
      paymentByCash: order.paymentByCash === true,
      paymentByBankTransfer: order.paymentByBankTransfer === true,
      bankTransferNumber: order.bankTransferNumber,
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
  }
}

function convertToMapEntries(dishesMap) {
  let result = [];

  for (const key of Object.keys(dishesMap)) {
    result.push({"category": key, "dishes": dishesMap[key]})
  }

  return result;
}