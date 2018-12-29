import OrdersApiConnector from "../../lib/OrdersApiConnector";
import ApiConnector from "../../lib/ApiConnector";

export const SET_TODAY_ORDERS_LIST = "SET_TODAY_ORDERS_LIST";
export const FETCH_TODAY_ORDERS_ACTION = "FETCH_TODAY_ORDERS_ACTION";

export default {
  namespaced: true,
  state: {
    currentOrderEntries: [],
    createdOrders: [],
    orderingOrders: [],
    orderedOrders: [],
    deliveredOrders: []
  },
  mutations: {
    [SET_TODAY_ORDERS_LIST] (state, payload) {
      state.currentOrderEntries = payload.currentOrderEntries;
      state.createdOrders = payload.createdOrders;
      state.orderingOrders = payload.orderingOrders;
      state.orderedOrders = payload.orderedOrders;
      state.deliveredOrders = payload.deliveredOrders;
    }
  },
  actions: {
    [FETCH_TODAY_ORDERS_ACTION] ({state}, payload) {
      OrdersApiConnector.fetchTodaysOrders()
        .then(todayOrdersData => {
          this.commit(`todayOrders/${SET_TODAY_ORDERS_LIST}`, todayOrdersData);
          this.commit('setLoadingFalse');
        })
        .catch(errResponse => ApiConnector.handleError(errResponse))
    },
  }
};