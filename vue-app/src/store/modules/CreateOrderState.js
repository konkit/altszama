import OrdersApiConnector from "../../lib/OrdersApiConnector";
import ApiConnector from "../../lib/ApiConnector";

export const INIT_DATA = "INIT_DATA";
export const UPDATE_RESTAURANT_ID = "UPDATE_RESTAURANT_ID";
export const UPDATE_ORDER_DATE = "UPDATE_ORDER_DATE";
export const UPDATE_TIME_OF_ORDER = "UPDATE_TIME_OF_ORDER";
export const UPDATE_DECREASE_IN_PERCENT = "UPDATE_DECREASE_IN_PERCENT";
export const UPDATE_DELIVERY_COST_PER_EVERYBODY = "UPDATE_DELIVERY_COST_PER_EVERYBODY";
export const UPDATE_DELIVERY_COST_PER_DISH = "UPDATE_DELIVERY_COST_PER_DISH";
export const UPDATE_PAYMENT_BY_CASH = "UPDATE_PAYMENT_BY_CASH";
export const UPDATE_PAYMENT_BY_BANK_TRANSFER = "UPDATE_PAYMENT_BY_BANK_TRANSFER";
export const UPDATE_BANK_TRANSFER_NUMBER = "UPDATE_BANK_TRANSFER_NUMBER";

export const INIT_CREATE_ORDER_ACTION = "INIT_CREATE_ORDER_ACTION";
export const SAVE_ORDER_ACTION = "SAVE_ORDER_ACTION";

export default {
  namespaced: true,
  state: {
    restaurantsList: [],

    // Order
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
    [INIT_DATA] (state, payload) {
      state.restaurantsList = payload.restaurantsList;

      state.restaurantId = payload.order.restaurantId;
      state.orderDate = payload.order.orderDate;
      state.timeOfOrder = payload.order.timeOfOrder;
      state.decreaseInPercent = payload.order.decreaseInPercent;
      state.deliveryCostPerEverybody = payload.order.deliveryCostPerEverybody;
      state.deliveryCostPerDish = payload.order.deliveryCostPerDish;
      state.paymentByCash = payload.order.paymentByCash;
      state.paymentByBankTransfer = payload.order.paymentByBankTransfer ;
      state.bankTransferNumber = payload.order.bankTransferNumber;
    },
    [UPDATE_RESTAURANT_ID] (state, newValue) {
      state.restaurantId = newValue
    },
    [UPDATE_ORDER_DATE] (state, newOrderDate) {
      state.orderDate = newOrderDate
    },
    [UPDATE_TIME_OF_ORDER] (state, newTimeOfOrder) {
      state.timeOfOrder = newTimeOfOrder;
    },
    [UPDATE_DECREASE_IN_PERCENT] (state, newValue) {
      state.decreaseInPercent = newValue;
    },
    [UPDATE_DELIVERY_COST_PER_EVERYBODY] (state, newValue) {
      state.deliveryCostPerEverybody = newValue;
    },
    [UPDATE_DELIVERY_COST_PER_DISH] (state, newValue) {
      state.deliveryCostPerDish = newValue;
    },
    [UPDATE_PAYMENT_BY_CASH] (state, newValue) {
      state.paymentByCash = newValue;
    },
    [UPDATE_PAYMENT_BY_BANK_TRANSFER] (state, newValue) {
      state.paymentByBankTransfer = newValue;
    },
    [UPDATE_BANK_TRANSFER_NUMBER] (state, newValue) {
      state.bankTransferNumber = newValue;
    },
  },
  actions: {
    [INIT_CREATE_ORDER_ACTION] (context) {
      OrdersApiConnector.getOrderCreateData()
        .then(response => {
          this.commit('createOrder/initData', response);
          this.commit('setLoadingFalse')
        })
        .catch(errResponse => ApiConnector.handleError(errResponse))
    },
    [SAVE_ORDER_ACTION] ({state}, payload) {
      const order = {
        restaurantId: state.restaurantId,
        orderDate: state.orderDate,
        timeOfOrder: state.timeOfOrder,
        decreaseInPercent: state.decreaseInPercent,
        deliveryCostPerEverybody: state.deliveryCostPerEverybody,
        deliveryCostPerDish: state.deliveryCostPerDish,
        paymentByCash: state.paymentByCash,
        paymentByBankTransfer: state.paymentByBankTransfer,
        bankTransferNumber: state.bankTransferNumber,
      };

      OrdersApiConnector.createOrder(order)
        .catch(errResponse => ApiConnector.handleError(errResponse));

      return false;
    }
  },
};