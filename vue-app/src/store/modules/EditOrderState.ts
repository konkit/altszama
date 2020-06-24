import OrdersApiConnector from "../../lib/OrdersApiConnector";
import ApiConnector from "../../lib/ApiConnector";
import {FETCH_ORDER_DATA_ACTION, NAMESPACE_SHOW_ORDER} from "./ShowOrderState";
import {CANCEL_DISH_ENTRY_MODIFICATION, NAMESPACE_MODIFY_ORDER_ENTRY} from "./ModifyOrderEntryState";

export const INIT_DATA = "INIT_DATA";
export const UPDATE_ORDER = "UPDATE_ORDER";
export const UPDATE_ORDER_DATE = "UPDATE_ORDER_DATE";
export const UPDATE_TIME_OF_ORDER = "UPDATE_TIME_OF_ORDER";
export const UPDATE_DECREASE_IN_PERCENT = "UPDATE_DECREASE_IN_PERCENT";
export const UPDATE_DELIVERY_COST_PER_EVERYBODY = "UPDATE_DELIVERY_COST_PER_EVERYBODY";
export const UPDATE_DELIVERY_COST_PER_DISH = "UPDATE_DELIVERY_COST_PER_DISH";
export const UPDATE_PAYMENT_BY_CASH = "UPDATE_PAYMENT_BY_CASH";
export const UPDATE_PAYMENT_BY_BANK_TRANSFER = "UPDATE_PAYMENT_BY_BANK_TRANSFER";
export const UPDATE_BANK_TRANSFER_NUMBER = "UPDATE_BANK_TRANSFER_NUMBER";
export const UPDATE_PAYMENT_BY_BLIK = "UPDATE_PAYMENT_BY_BLIK";
export const UPDATE_BLIK_PHONE_NUMBER = "UPDATE_BLIK_PHONE_NUMBER";

export const INIT_EDIT_ORDER_ACTION = "INIT_EDIT_ORDER_ACTION";
export const UPDATE_ORDER_ACTION = "UPDATE_ORDER_ACTION";

export default {
  namespaced: true,
  state: {
    // Order
    orderId: 0,
    restaurantId: 0,
    restaurantName: "",
    orderDate: "",
    timeOfOrder: "",
    decreaseInPercent: "",
    deliveryCostPerEverybody: "",
    deliveryCostPerDish: "",
    paymentByCash: true,
    paymentByBankTransfer: false,
    bankTransferNumber: "",
    paymentByBlik: false,
    blikPhoneNumber: ""
  },
  mutations: {
    [INIT_DATA] (state, payload) {
      state.orderId = payload.orderId;

      state.restaurantName = payload.order.restaurantName;
      state.orderDate = payload.order.orderDate;
      state.timeOfOrder = payload.order.timeOfOrder;
      state.decreaseInPercent = payload.order.decreaseInPercent;
      state.deliveryCostPerEverybody = payload.order.deliveryCostPerEverybody;
      state.deliveryCostPerDish = payload.order.deliveryCostPerDish;
      state.paymentByCash = payload.order.paymentByCash;
      state.paymentByBankTransfer = payload.order.paymentByBankTransfer;
      state.bankTransferNumber = payload.order.bankTransferNumber || "";
      state.paymentByBlik = payload.order.paymentByBlik ;
      state.blikPhoneNumber = payload.order.blikPhoneNumber || "";
    },
    [UPDATE_ORDER] (state, newOrder) {
      state.order = newOrder;
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
    [UPDATE_PAYMENT_BY_BLIK] (state, newValue) {
      state.paymentByBlik = newValue;
    },
    [UPDATE_BLIK_PHONE_NUMBER] (state, newValue) {
      state.blikPhoneNumber = newValue;
    },
  },
  actions: {
    [INIT_EDIT_ORDER_ACTION] (context, payload) {
      OrdersApiConnector.getOrderEditData(payload.orderId)
        .then(response => {
          const responseWithOrderId = Object.assign(response, {orderId: payload.orderId});

          this.commit(`editOrder/${INIT_DATA}`, responseWithOrderId);
          this.commit('setLoadingFalse')

          document.title = `Edit order from ${context.state.restaurantName} | Alt Szama`
        })
        .catch(errResponse => ApiConnector.handleError(errResponse))
    },
    [UPDATE_ORDER_ACTION] ({state}) {
      const order = {
        orderId: state.orderId,
        orderDate: state.orderDate,
        timeOfOrder: state.timeOfOrder,
        decreaseInPercent: state.decreaseInPercent,
        deliveryCostPerEverybody: state.deliveryCostPerEverybody,
        deliveryCostPerDish: state.deliveryCostPerDish,
        paymentByCash: state.paymentByCash,
        paymentByBankTransfer: state.paymentByBankTransfer,
        bankTransferNumber: state.bankTransferNumber || "",
        paymentByBlik: state.paymentByBlik,
        blikPhoneNumber: state.blikPhoneNumber || ""
      };

      OrdersApiConnector.editOrder(order.orderId, order)
        .then(() => {
          this.commit('setLoadingTrue');
          this.commit(`${NAMESPACE_MODIFY_ORDER_ENTRY}/${CANCEL_DISH_ENTRY_MODIFICATION}`, {});
          this.dispatch(`${NAMESPACE_SHOW_ORDER}/${FETCH_ORDER_DATA_ACTION}`, {orderId: state.orderId});
        })
        .catch(errResponse => ApiConnector.handleError(errResponse))
    }
  }
};