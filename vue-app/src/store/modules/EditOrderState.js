import {mapMutations} from "vuex";

export default {
  namespaced: true,
  state: {
    restaurantsList: [],

    // Order
    restaurantId: 0,
    orderId: 0,
    orderDate: "",
    timeOfOrder: "",
    decreaseInPercent: "",
    deliveryCostPerEverybody: "",
    deliveryCostPerDish: "",
    paymentByCash: true,
    paymentByBankTransfer: false,
    bankTransferNumber: "",
  },
  mutations: {
    initData (state, payload) {
      state.restaurantsList = payload.restaurantsList;

      state.restaurantId = payload.order.restaurantId;
      state.orderId = payload.order.orderId;
      state.orderDate = payload.order.orderDate;
      state.timeOfOrder = payload.order.timeOfOrder;
      state.decreaseInPercent = payload.order.decreaseInPercent;
      state.deliveryCostPerEverybody = payload.order.deliveryCostPerEverybody;
      state.deliveryCostPerDish = payload.order.deliveryCostPerDish;
      state.paymentByCash = payload.order.paymentByCash;
      state.paymentByBankTransfer = payload.order.paymentByBankTransfer;
      state.bankTransferNumber = payload.order.bankTransferNumber;
    },
    updateRestaurantId(state, newValue) {
      state.restaurantId = newValue
    },
    updateOrder (state, newOrder) {
      state.order = newOrder;
    },
    updateOrderDate (state, newOrderDate) {
      state.orderDate = newOrderDate
    },
    updateTimeOfOrder (state, newTimeOfOrder) {
      state.timeOfOrder = newTimeOfOrder;
    },
    updateDecreaseInPercent(state, newValue) {
      state.decreaseInPercent = newValue;
    },
    updateDeliveryCostPerEverybody(state, newValue) {
      state.deliveryCostPerEverybody = newValue;
    },
    updateDeliveryCostPerDish(state, newValue) {
      state.deliveryCostPerDish = newValue;
    },
    updatePaymentByCash(state, newValue) {
      state.paymentByCash = newValue;
    },
    updatePaymentByBankTransfer(state, newValue) {
      state.paymentByBankTransfer = newValue;
    },
    updateBankTransferNumber(state, newValue) {
      state.bankTransferNumber = newValue;
    },
  },
};