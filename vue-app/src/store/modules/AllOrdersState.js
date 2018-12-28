import OrdersApiConnector from "../../lib/OrdersApiConnector";
import ApiConnector from "../../lib/ApiConnector";
import {FETCH_ALL_ORDERS} from "../mutation-types"

export default {
  namespaced: true,
  state: {
    allOrdersList: []
  },
  mutations: {
    setAllOrdersList(state, payload) {
      state.allOrdersList = payload
    }
  },
  actions: {
    [FETCH_ALL_ORDERS] (context) {
      OrdersApiConnector.fetchAllOrders()
        .then(allOrdersList => {
          this.commit('allOrders/setAllOrdersList', allOrdersList);
          this.commit('setLoadingFalse')
        })
        .catch(errResponse => ApiConnector.handleError(errResponse))
    }
  }
};