import OrdersApiConnector from "../../lib/OrdersApiConnector";
import ApiConnector from "../../lib/ApiConnector";

export const SET_TODAY_ORDERS_LIST = "SET_TODAY_ORDERS_LIST";
export const FETCH_TODAY_ORDERS_ACTION = "FETCH_TODAY_ORDERS_ACTION";

export default {
  namespaced: true,
  state: {
    currentOrderEntries: [],
    ordersList: [],
  },
  mutations: {
    [SET_TODAY_ORDERS_LIST] (state, payload) {
      state.currentOrderEntries = payload.currentOrderEntries;
      state.ordersList = payload.ordersList;
    }
  },
  actions: {
    [FETCH_TODAY_ORDERS_ACTION] () {
      OrdersApiConnector.fetchTodaysOrders()
        .then(todayOrdersData => {
          this.commit(`todayOrders/${SET_TODAY_ORDERS_LIST}`, todayOrdersData);
          this.commit('setLoadingFalse');
          document.title = `Today orders | Alt Szama`
        })
        .catch(errResponse => ApiConnector.handleError(errResponse))
    },
  }
};