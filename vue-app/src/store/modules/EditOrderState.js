import OrdersApiConnector from "../../lib/OrdersApiConnector";
import ApiConnector from "../../lib/ApiConnector";

export default {
  namespaced: true,
  state: {
    restaurantsList: [],

    // Order
    orderId: 0,
    restaurantId: 0,
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
      state.orderId = payload.orderId;

      state.restaurantId = payload.order.restaurantId;
      state.orderDate = payload.order.orderDate;
      state.timeOfOrder = payload.order.timeOfOrder;
      state.decreaseInPercent = payload.order.decreaseInPercent;
      state.deliveryCostPerEverybody = payload.order.deliveryCostPerEverybody;
      state.deliveryCostPerDish = payload.order.deliveryCostPerDish;
      state.paymentByCash = payload.order.paymentByCash;
      state.paymentByBankTransfer = payload.order.paymentByBankTransfer;
      state.bankTransferNumber = payload.order.bankTransferNumber || "";
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
  actions: {
    initEditOrder(context, payload) {
      OrdersApiConnector.getOrderEditData(payload.orderId)
        .then(response => {
          const responseWithOrderId = Object.assign(response, {orderId: payload.orderId});

          console.log("responseWithOrderId: ", responseWithOrderId);

          this.commit('editOrder/initData', responseWithOrderId);
          this.commit('setLoadingFalse')
        })
        .catch(errResponse => ApiConnector.handleError(errResponse))
    },
    updateOrder({state}, payload) {
      let errorsComponent = payload.errorsComponent;

      const order = {
        restaurantId: state.restaurantId,
        orderId: state.orderId,
        orderDate: state.orderDate,
        timeOfOrder: state.timeOfOrder,
        decreaseInPercent: state.decreaseInPercent,
        deliveryCostPerEverybody: state.deliveryCostPerEverybody,
        deliveryCostPerDish: state.deliveryCostPerDish,
        paymentByCash: state.paymentByCash,
        paymentByBankTransfer: state.paymentByBankTransfer,
        bankTransferNumber: state.bankTransferNumber || "",
      };

      console.log("Order: ", order);

      OrdersApiConnector.editOrder(order.orderId, order)
        .catch(error => ApiConnector.handleError(error) && error.body.messages.forEach(msg => errorsComponent.addError(msg)));
    }
  }
};