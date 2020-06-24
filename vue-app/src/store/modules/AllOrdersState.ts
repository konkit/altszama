import OrdersApiConnector from "../../lib/OrdersApiConnector";
import ApiConnector from "../../lib/ApiConnector";

export const SET_ALL_ORDERS_LIST = "SET_ALL_ORDERS_LIST";
export const FETCH_ALL_ORDERS = "FETCH_ALL_ORDERS";

export default {
  namespaced: true,
  state: {
    allOrdersList: []
  },
  mutations: {
    [SET_ALL_ORDERS_LIST] (state, payload) {
      state.allOrdersList = payload
    }
  },
  actions: {
    [FETCH_ALL_ORDERS] () {
      OrdersApiConnector.fetchAllOrders()
        .then(allOrdersList => {
          this.commit(`allOrders/${SET_ALL_ORDERS_LIST}`, allOrdersList);
          this.commit('setLoadingFalse');

          document.title = `All orders | Alt Szama`
        })
        .catch(errResponse => ApiConnector.handleError(errResponse))
    }
  }
};