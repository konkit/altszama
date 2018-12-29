import OrdersApiConnector from "../../lib/OrdersApiConnector";
import ApiConnector from "../../lib/ApiConnector";

export const SET_ALL_ORDERS_LIST = "SET_ALL_ORDERS_LIST";
export const FETCH_ORDER_VIEW_DATA_ACTION = "FETCH_ORDER_VIEW_DATA_ACTION";
export const MAKE_AN_ORDER_ACTION = "MAKE_AN_ORDER_ACTION";

export default {
  namespaced: true,
  state: {
    order: {
      restaurant: {}
    },
    groupedEntries: [],
    allEatingPeopleCount: 0,
    basePriceSum: 0,
    totalPrice: 0,
    approxTimeOfDelivery: "12:00",
  },
  mutations: {
    [SET_ALL_ORDERS_LIST] (state, payload) {
      state.allOrdersList = payload
    }
  },
  actions: {
    [FETCH_ORDER_VIEW_DATA_ACTION] ({state}, payload) {
      OrdersApiConnector.fetchOrderView(payload.orderId)
        .then(responseObj => {
          state.order = responseObj.order;
          state.groupedEntries = responseObj.groupedEntries;
          state.allEatingPeopleCount = responseObj.allEatingPeopleCount;
          state.basePriceSum = responseObj.basePriceSum;
          state.totalPrice = responseObj.totalPrice;

          this.commit('setLoadingFalse')
        })
        .catch(errResponse => ApiConnector.handleError(errResponse))
    },
    [MAKE_AN_ORDER_ACTION] (context, payload) {
      OrdersApiConnector.makeAnOrder(this.orderId, {approxTimeOfDelivery: payload.approxTimeOfDelivery})
        .catch(errResponse => ApiConnector.handleError(errResponse))
    }
  }
};