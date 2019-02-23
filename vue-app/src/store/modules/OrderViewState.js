import OrdersApiConnector from "../../lib/OrdersApiConnector";
import ApiConnector from "../../lib/ApiConnector";

export const SET_ALL_ORDERS_LIST = "SET_ALL_ORDERS_LIST";
export const FETCH_ORDER_VIEW_DATA_ACTION = "FETCH_ORDER_VIEW_DATA_ACTION";
export const MAKE_AN_ORDER_ACTION = "MAKE_AN_ORDER_ACTION";
export const UPDATE_APPROX_TIME_OF_DELIVERY = "UPDATE_APPROX_TIME_OF_DELIVERY";

export default {
  namespaced: true,
  state: {
    orderId: "",
    orderState: "",
    orderDecreaseInPercent: 0,
    orderDeliveryCostPerEverybody: 0,
    orderDeliveryCostPerDish: 0,
    restaurantName: "",
    restaurantTelephone: "",
    groupedEntries: [],
    allEatingPeopleCount: 0,
    basePriceSum: 0,
    totalPrice: 0,
    approxTimeOfDelivery: "12:00",
  },
  mutations: {
    [SET_ALL_ORDERS_LIST] (state, newValue) {
      state.allOrdersList = newValue
    },
    [UPDATE_APPROX_TIME_OF_DELIVERY] (state, newValue) {
      state.allOrdersList = newValue
    }
  },
  actions: {
    [FETCH_ORDER_VIEW_DATA_ACTION] ({state}, payload) {
      OrdersApiConnector.fetchOrderView(payload.orderId)
        .then(responseObj => {
          state.orderId = payload.orderId;
          state.orderState = responseObj.orderState;
          state.orderDecreaseInPercent = responseObj.orderDecreaseInPercent;
          state.orderDeliveryCostPerEverybody = responseObj.orderDeliveryCostPerEverybody;
          state.orderDeliveryCostPerDish = responseObj.orderDeliveryCostPerDish;
          state.restaurantName = responseObj.restaurantName;
          state.restaurantTelephone = responseObj.restaurantTelephone;
          state.groupedEntries = responseObj.groupedEntries;
          state.allEatingPeopleCount = responseObj.allEatingPeopleCount;
          state.basePriceSum = responseObj.basePriceSum;
          state.totalPrice = responseObj.totalPrice;

          this.commit('setLoadingFalse')
        })
        .catch(errResponse => ApiConnector.handleError(errResponse))
    },
    [MAKE_AN_ORDER_ACTION] ({state, rootState}, payload) {
      OrdersApiConnector.makeAnOrder(state.orderId, {approxTimeOfDelivery: payload.approxTimeOfDelivery})
        .catch(errResponse => ApiConnector.handleError(errResponse))
    }
  }
};