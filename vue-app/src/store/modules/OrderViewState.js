import OrdersApiConnector from "../../lib/OrdersApiConnector";
import ApiConnector from "../../lib/ApiConnector";

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
    setAllOrdersList(state, payload) {
      state.allOrdersList = payload
    }
  },
  actions: {
    fetchOrderViewData({state}, payload) {
      let errorsComponent = payload.errorsComponent;

      OrdersApiConnector.fetchOrderView(payload.orderId)
        .then(responseObj => {
          state.order = responseObj.order;
          state.groupedEntries = responseObj.groupedEntries;
          state.allEatingPeopleCount = responseObj.allEatingPeopleCount;
          state.basePriceSum = responseObj.basePriceSum;
          state.totalPrice = responseObj.totalPrice;

          this.commit('setLoadingFalse')
        })
        .catch(errResponse => {
          ApiConnector.handleError(errResponse)
          errorsComponent.addError(errResponse.body.message);
        })
    },
    makeAnOrder(context, payload) {
      let errorsComponent = payload.errorsComponent;

      OrdersApiConnector.makeAnOrder(this.orderId, {approxTimeOfDelivery: payload.approxTimeOfDelivery})
        .catch(error => {
          errorsComponent.addError(error.body.message);
        });
    }
  }
};