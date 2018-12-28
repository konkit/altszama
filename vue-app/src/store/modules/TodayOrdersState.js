import OrdersApiConnector from "../../lib/OrdersApiConnector";
import ApiConnector from "../../lib/ApiConnector";

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
    setTodayOrdersList(state, payload) {
      console.log("payload: ", payload);

      state.currentOrderEntries = payload.currentOrderEntries;
      state.createdOrders = payload.createdOrders;
      state.orderingOrders = payload.orderingOrders;
      state.orderedOrders = payload.orderedOrders;
      state.deliveredOrders = payload.deliveredOrders;

      console.log("state: ", state);
    }
  },
  actions: {
    fetchTodayOrders({state}, payload) {
      let errorsComponent = payload.errorsComponent;

      OrdersApiConnector.fetchTodaysOrders()
        .then(todayOrdersData => {
          this.commit('todayOrders/setTodayOrdersList', todayOrdersData);
          this.commit('setLoadingFalse');
        })
        .catch(errResponse => ApiConnector.handleError(errResponse))
    },
  }
};