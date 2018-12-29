import OrdersApiConnector from "../../lib/OrdersApiConnector";
import ApiConnector from "../../lib/ApiConnector";

export const LOAD_SHOW_ORDER_DATA = "LOAD_SHOW_ORDER_DATA";
export const SET_ENTRY_CREATING = "SET_ENTRY_CREATING";
export const SET_ENTRY_EDITING = "SET_ENTRY_EDITING";
export const CANCEL_ENTRY_CREATE_OR_EDIT = "CANCEL_ENTRY_CREATE_OR_EDIT";
export const SET_EDITED_ORDER_ENTRY = "SET_EDITED_ORDER_ENTRY";
export const CLEAR_EDITED_SIDE_DISHES = "CLEAR_EDITED_SIDE_DISHES";
export const SET_NEW_DISH_FLAG = "SET_NEW_DISH_FLAG";

export const FETCH_ORDER_DATA_ACTION = "FETCH_ORDER_DATA_ACTION";
export const SAVE_ORDER_ENTRY_ACTION = "SAVE_ORDER_ENTRY_ACTION";
export const EDIT_ORDER_ENTRY_ACTION = "EDIT_ORDER_ENTRY_ACTION";
export const UNLOCK_ORDER_ACTION = "UNLOCK_ORDER_ACTION";
export const DELETE_DISH_ENTRY_ACTION = "DELETE_DISH_ENTRY_ACTION";
export const CONFIRM_ORDER_ENTRY_AS_PAID_ACTION = "CONFIRM_ORDER_ENTRY_AS_PAID_ACTION";
export const MARK_ORDER_ENTRY_AS_PAID_ACTION = "MARK_ORDER_ENTRY_AS_PAID_ACTION";
export const SET_ORDER_AS_CREATED_ACTION = "SET_ORDER_AS_CREATED_ACTION";
export const SET_ORDER_AS_ORDERED_ACTION = "SET_ORDER_AS_ORDERED_ACTION";
export const SET_ORDER_AS_DELIVERED_ACTION = "SET_ORDER_AS_DELIVERED_ACTION";
export const SET_ORDER_AS_REJECTED_ACTION = "SET_ORDER_AS_REJECTED_ACTION";
export const DELETE_ORDER_ACTION = "DELETE_ORDER_ACTION";
export const SET_ENTRY_LOADING_TRUE = "SET_ENTRY_LOADING_TRUE";
export const SET_ENTRY_LOADING_FALSE = "SET_ENTRY_LOADING_FALSE";

export default {
  namespaced: true,
  state: {
    order: {
      restaurant: {
        name: ""
      },
      orderCreator: {}
    },
    orderEntries: [],
    currentUserId: '',
    allDishesInRestaurant: [],
    allDishesByCategory: [],
    dishIdToSideDishesMap: [],
    totalOrderPrice: 0,

    isEntryCreating: false,
    isEntryEdited: false,
    orderEntryId: "",
    dishEntryId: "",

    editedOrderEntry: {},
  },
  mutations: {
    [LOAD_SHOW_ORDER_DATA] (state, payload) {
      state.order = payload.order;
      state.orderEntries = payload.orderEntries;
      state.currentUserId = payload.currentUserId;
      state.allDishesInRestaurant = payload.allDishesInRestaurant;
      state.allDishesByCategory = payload.allDishesByCategory;
      state.dishIdToSideDishesMap = payload.dishIdToSideDishesMap;
      state.totalOrderPrice = payload.totalOrderPrice;
    },
    [SET_ENTRY_CREATING] (state, payload) {
      state.isEntryCreating = true;
      state.orderEntryId = "";
      state.dishEntryId = "";
    },
    [SET_ENTRY_EDITING] (state, payload) {
      state.isEntryEdited = true;
      state.orderEntryId = payload.orderEntryId;
      state.dishEntryId = payload.dishEntryId;
    },
    [CANCEL_ENTRY_CREATE_OR_EDIT] (state, payload) {
      state.isEntryCreating = false;
      state.isEntryEdited = false;
      state.orderEntryId = "";
      state.dishEntryId = "";
    },
    [SET_EDITED_ORDER_ENTRY] (state, payload) {
      state.editedOrderEntry = payload
    },
    [CLEAR_EDITED_SIDE_DISHES] (state, payload) {
      state.editedOrderEntry.chosenSideDishes = []
    },
    [SET_NEW_DISH_FLAG] (state, newDishValue) {
      state.editedOrderEntry.newDish = newDishValue;

      if (newDishValue === true) {
        state.editedOrderEntry.dishId = ""
      }
    },
    [SET_ENTRY_LOADING_TRUE] (state) {
      state.loadingEntry = true;
    },
    [SET_ENTRY_LOADING_FALSE] (state) {
      state.loadingEntry = false;
    },
  },
  actions: {
    [FETCH_ORDER_DATA_ACTION] ({state}, payload) {
      const orderId = payload.orderId;

      OrdersApiConnector
        .fetchOrder(orderId)
        .then(showOrderData => {
          this.commit(`showOrder/${LOAD_SHOW_ORDER_DATA}`, showOrderData);
          this.commit('setLoadingFalse')
        })
        .catch(errResponse => ApiConnector.handleError(errResponse))
    },
    [SAVE_ORDER_ENTRY_ACTION] ({state}, {orderId, editedOrderEntry, errorsComponent}) {
      OrdersApiConnector.saveOrderEntry(orderId, editedOrderEntry)
        .then(() => {
          // this.$emit("updateOrder");
          this.commit('setLoadingTrue');
          this.dispatch(`showOrder/${FETCH_ORDER_DATA_ACTION}`, {orderId: orderId})
            .then(this.commit(`showOrder/${CANCEL_ENTRY_CREATE_OR_EDIT}`, {}))
        })
        .catch(errResponse => ApiConnector.handleError(errResponse))
    },
    [EDIT_ORDER_ENTRY_ACTION] ({state}, {orderId, orderEntryId, editedOrderEntry, errorsComponent}) {
      OrdersApiConnector.editOrderEntry(this.order.id, this.orderEntry.id, this.editedOrderEntry)
        .then(() => {
          // this.$emit("updateOrder");
          this.commit('setLoadingTrue');
          this.dispatch(`showOrder/${FETCH_ORDER_DATA_ACTION}`, {orderId: orderId})
            .then(this.commit(`showOrder/${CANCEL_ENTRY_CREATE_OR_EDIT}`, {}))
        })
        .catch(errResponse => ApiConnector.handleError(errResponse))
    },
    [UNLOCK_ORDER_ACTION] ({state}, {orderId}) {
      OrdersApiConnector.setOrderAsCreated(orderId)
        .then(response => {
          this.commit('setLoadingTrue');
          this.dispatch(`showOrder/${FETCH_ORDER_DATA_ACTION}`, {orderId: orderId})
        })
        .catch(errResponse => ApiConnector.handleError(errResponse))
    },
    [DELETE_DISH_ENTRY_ACTION] ({state}, {orderId, orderEntryId, dishEntryId}) {
      OrdersApiConnector.deleteDishEntry(orderEntryId, dishEntryId)
        .then(successResponse => {
          this.commit('setLoadingTrue');
          this.dispatch(`showOrder/${FETCH_ORDER_DATA_ACTION}`, {orderId: orderId})
        })
        .catch(errResponse => ApiConnector.handleError(errResponse))
    },
    [CONFIRM_ORDER_ENTRY_AS_PAID_ACTION] ({state}, {orderEntryId}) {
      OrdersApiConnector.confirmOrderEntryAsPaid(orderEntryId)
        .then(successResponse => window.location.reload())
        .catch(errResponse => ApiConnector.handleError(errResponse))
    },
    [MARK_ORDER_ENTRY_AS_PAID_ACTION] ({state}, {orderEntryId}) {
      OrdersApiConnector.markOrderEntryAsPaid(orderEntryId)
        .then(successResponse => window.location.reload())
        .catch(errResponse => ApiConnector.handleError(errResponse))
    },
    [SET_ORDER_AS_CREATED_ACTION] ({state}, {orderId}) {
      OrdersApiConnector.setOrderAsCreated(orderId)
        .then(successResponse => window.location.reload())
        .catch(errResponse => ApiConnector.handleError(errResponse))
    },
    [SET_ORDER_AS_ORDERED_ACTION] ({state}, {orderId}) {
      OrdersApiConnector.setOrderAsOrdered(orderId)
        .then(successResponse => window.location.reload())
        .catch(errResponse => ApiConnector.handleError(errResponse))
    },
    [SET_ORDER_AS_DELIVERED_ACTION] ({state}, {orderId}) {
      OrdersApiConnector.setOrderAsDelivered(orderId)
        .then(successResponse => window.location.reload())
        .catch(errResponse => ApiConnector.handleError(errResponse))
    },
    [SET_ORDER_AS_REJECTED_ACTION] ({state}, {orderId}) {
      OrdersApiConnector.setOrderAsRejected(orderId)
        .then(successResponse => window.location.reload())
        .catch(errResponse => ApiConnector.handleError(errResponse))
    },
    [DELETE_ORDER_ACTION] ({state}, {orderId}) {
      OrdersApiConnector.deleteOrder(orderId + '/delete')
        .then(successResponse => window.location.href = '#/orders')
        .catch(errResponse => ApiConnector.handleError(errResponse))
    },
  }
};