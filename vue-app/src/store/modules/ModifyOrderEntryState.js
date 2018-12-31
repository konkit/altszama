import Vue from "vue";
import OrdersApiConnector from "../../lib/OrdersApiConnector";
import ApiConnector from "../../lib/ApiConnector";
import {FETCH_ORDER_DATA_ACTION, NAMESPACE_SHOW_ORDER} from "./ShowOrderState";

export const NAMESPACE_MODIFY_ORDER_ENTRY = "modifyOrderEntry";

export const SET_ENTRY_LOADING_TRUE = "SET_ENTRY_LOADING_TRUE";
export const SET_ENTRY_LOADING_FALSE = "SET_ENTRY_LOADING_FALSE";

export const SET_ENTRY_CREATING = "SET_ENTRY_CREATING";

export const SET_ENTRY_EDITING = "SET_ENTRY_EDITING";
export const SET_NEW_DISH_FLAG = "SET_NEW_DISH_FLAG";
export const CANCEL_ENTRY_CREATE_OR_EDIT = "CANCEL_ENTRY_CREATE_OR_EDIT";

export const UPDATE_DISH_ID = "UPDATE_DISH_ID";
export const UPDATE_ADDITIONAL_COMMENTS = "UPDATE_ADDITIONAL_COMMENTS";

export const UPDATE_NEW_DISH_NAME = "UPDATE_EDITED_ORDER_ENTRY_NEW_DISH_NAME";
export const UPDATE_NEW_DISH_PRICE = "UPDATE_EDITED_ORDER_ENTRY_NEW_DISH_PRICE";
export const UPDATE_NEW_SIDE_DISH_NAME = "UPDATE_NEW_SIDE_DISH_NAME";
export const UPDATE_NEW_SIDE_DISH_PRICE = "UPDATE_NEW_SIDE_DISH_PRICE";
export const SET_SIDE_DISH = "SET_SIDE_DISH";
export const SET_SIDE_DISH_AS_NEW = "SET_SIDE_DISH_AS_NEW";
export const SET_SIDE_DISH_AS_EXISTING = "SET_SIDE_DISH_AS_EXISTING";

export const CLEAR_EDITED_SIDE_DISHES = "CLEAR_EDITED_SIDE_DISHES";

export const ADD_SIDE_DISH = "ADD_SIDE_DISH";
export const REMOVE_SIDE_DISH = "REMOVE_SIDE_DISH";

export const SET_INITIAL_CREATED_ORDER_ENTRY = "SET_INITIAL_CREATED_ORDER_ENTRY";
export const SET_INITIAL_EDITED_ORDER_ENTRY = "SET_INITIAL_EDITED_ORDER_ENTRY";

export const SETUP_CREATE_ORDER_ENTRY_ACTION = "SETUP_CREATE_ORDER_ENTRY_ACTION";
export const SETUP_EDIT_ORDER_ENTRY_ACTION = "SETUP_EDIT_ORDER_ENTRY_ACTION";
export const ADD_SIDE_DISH_ACTION = "ADD_SIDE_DISH_ACTION";
export const UPDATE_SIDE_DISH_ACTION = "UPDATE_SIDE_DISH_ACTION";
export const SAVE_ORDER_ENTRY_ACTION = "SAVE_ORDER_ENTRY_ACTION";
export const UPDATE_ORDER_ENTRY_ACTION = "UPDATE_ORDER_ENTRY_ACTION";

export default {
  namespaced: true,
  state: {
    loadingEntry: false,

    isEntryCreating: false,
    isEntryEdited: false,
    orderEntryId: "",
    dishEntryId: "",

    orderId: '',
    dishId: '',
    additionalComments: '',
    newDish: false,
    newDishName: "",
    newDishPrice: "",
    chosenSideDishes: []
  },
  mutations: {
    [SET_ENTRY_CREATING] (state) {
      state.isEntryCreating = true;
      state.isEntryEdited = false;
      state.orderEntryId = "";
      state.dishEntryId = "";
    },
    [SET_ENTRY_EDITING] (state, payload) {
      state.isEntryCreating = false;
      state.isEntryEdited = true;
      state.orderEntryId = payload.orderEntryId;
      state.dishEntryId = payload.dishEntryId;
    },
    [CANCEL_ENTRY_CREATE_OR_EDIT] (state) {
      state.isEntryCreating = false;
      state.isEntryEdited = false;
      state.orderEntryId = "";
      state.dishEntryId = "";
    },
    [UPDATE_DISH_ID] (state, newValue) {
      state.dishId = newValue;
    },
    [UPDATE_ADDITIONAL_COMMENTS] (state, newValue) {
      state.additionalComments = newValue;
    },
    [UPDATE_NEW_DISH_NAME] (state, newValue) {
      state.newDishName = newValue;
    },
    [UPDATE_NEW_DISH_PRICE] (state, newValue) {
      state.newDishPrice = newValue;
    },
    [SET_ENTRY_LOADING_TRUE] (state) {
      state.loadingEntry = true;
    },
    [SET_ENTRY_LOADING_FALSE] (state) {
      state.loadingEntry = false;
    },
    [UPDATE_NEW_SIDE_DISH_NAME] (state, {sdIndex, newValue}) {
      state.chosenSideDishes[sdIndex].newSideDishName = newValue
    },
    [UPDATE_NEW_SIDE_DISH_PRICE] (state, {sdIndex, newValue}) {
      state.chosenSideDishes[sdIndex].newSideDishPrice = newValue
    },
    [SET_SIDE_DISH] (state, {sdIndex, newValue}) {
      state.chosenSideDishes[sdIndex] = newValue
    },
    [SET_SIDE_DISH_AS_NEW] (state, {sdIndex}) {
      Vue.set(state.chosenSideDishes[sdIndex], "isNew", true);
    },
    [SET_SIDE_DISH_AS_EXISTING] (state, {sdIndex}) {
      Vue.set(state.chosenSideDishes[sdIndex], "isNew", false);
    },
    [ADD_SIDE_DISH] (state, sideDishToAdd) {
      state.chosenSideDishes.push(sideDishToAdd);
    },
    [REMOVE_SIDE_DISH] (state, {sdIndex}) {
      state.chosenSideDishes.splice(sdIndex, 1)
    },
    [CLEAR_EDITED_SIDE_DISHES] (state) {
      state.chosenSideDishes = []
    },
    [SET_NEW_DISH_FLAG] (state, newDishValue) {
      state.newDish = newDishValue;

      if (newDishValue === true) {
        state.dishId = ""
      }
    },
    [SET_INITIAL_CREATED_ORDER_ENTRY] (state, {orderId, dishId}) {
      state.orderId = orderId;
      state.dishId = dishId;
      state.additionalComments = "";
      state.newDish = false;
      state.newDishName = "";
      state.newDishPrice = 0;
      state.chosenSideDishes = [];
    },
    [SET_INITIAL_EDITED_ORDER_ENTRY] (state, {orderId, dishEntry}) {
      state.orderId = orderId;
      state.dishId = dishEntry.dish.id;
      state.dishEntryId = dishEntry.id;
      state.additionalComments = dishEntry.additionalComments;
      state.newDish = false;
      state.newDishName = "";
      state.newDishPrice = 0;
      state.chosenSideDishes = dishEntry.sideDishes || [];
    }
  },
  actions: {
    [SETUP_CREATE_ORDER_ENTRY_ACTION] ({state, rootState}) {
      const orderId = rootState.showOrder.order.id;

      let dishId;
      if (rootState.showOrder.allDishesInRestaurant.length > 0) {
        dishId = rootState.showOrder.allDishesInRestaurant[0].id;
      } else {
        dishId = null
      }

      this.commit(`${NAMESPACE_MODIFY_ORDER_ENTRY}/${SET_INITIAL_CREATED_ORDER_ENTRY}`, {orderId: orderId, dishId: dishId})
    },
    [SETUP_EDIT_ORDER_ENTRY_ACTION] ({state, rootState}, {dishEntry}) {
      const orderId = rootState.showOrder.order.id;

      this.commit(`${NAMESPACE_MODIFY_ORDER_ENTRY}/${SET_INITIAL_EDITED_ORDER_ENTRY}`, {orderId: orderId, dishEntry: dishEntry});
      this.commit(`${NAMESPACE_MODIFY_ORDER_ENTRY}/${SET_ENTRY_LOADING_FALSE}`)
    },
    [SAVE_ORDER_ENTRY_ACTION] ({state}) {
      const orderId = state.orderId;

      const orderEntryToSave = {
        orderId: state.orderId,
        dishId: state.dishId,
        dishEntryId: state.dishEntryId,
        additionalComments: state.additionalComments,
        newDish: state.newDish,
        newDishName: state.newDishName,
        newDishPrice: state.newDishPrice,
        chosenSideDishes: state.chosenSideDishes
      };

      OrdersApiConnector.saveOrderEntry(orderId, orderEntryToSave)
        .then(() => {
          this.commit('setLoadingTrue');
          this.commit(`${NAMESPACE_MODIFY_ORDER_ENTRY}/${CANCEL_ENTRY_CREATE_OR_EDIT}`, {});
          this.dispatch(`${NAMESPACE_SHOW_ORDER}/${FETCH_ORDER_DATA_ACTION}`, {orderId: orderId})
        })
        .catch(errResponse => ApiConnector.handleError(errResponse))
    },
    [UPDATE_ORDER_ENTRY_ACTION] ({state, rootState, getters}, {orderEntryId}) {
      const orderId = state.orderId;
      const orderEntryToUpdate = {
        orderId: orderId,
        dishId: state.dishId,
        dishEntryId: state.dishEntryId,
        additionalComments: state.additionalComments,
        newDish: state.newDish,
        newDishName: state.newDishName,
        newDishPrice: state.newDishPrice,
        chosenSideDishes: state.chosenSideDishes
      };

      OrdersApiConnector.updateOrderEntry(orderId, orderEntryId, orderEntryToUpdate)
        .then(() => {
          this.commit('setLoadingTrue');
          this.commit(`${NAMESPACE_MODIFY_ORDER_ENTRY}/${CANCEL_ENTRY_CREATE_OR_EDIT}`, {});
          this.dispatch(`${NAMESPACE_SHOW_ORDER}/${FETCH_ORDER_DATA_ACTION}`, {orderId: orderId})
        })
        .catch(errResponse => ApiConnector.handleError(errResponse))
    },
    [ADD_SIDE_DISH_ACTION] ({state, rootState}) {
      const sideDishesForGivenDish = rootState.showOrder.dishIdToSideDishesMap[state.dishId];
      let sideDishToAdd = {};

      if (sideDishesForGivenDish && sideDishesForGivenDish.length > 0) {
        sideDishToAdd = Object.assign({}, sideDishesForGivenDish[0]);
        sideDishToAdd.isNew = false
      } else {
        sideDishToAdd = {};
        sideDishToAdd.isNew = true
      }

      sideDishToAdd.newSideDishName = "";
      sideDishToAdd.newSideDishPrice = 0;

      this.commit(`${NAMESPACE_SHOW_ORDER}/${ADD_SIDE_DISH}`, sideDishToAdd);
    },
    [UPDATE_SIDE_DISH_ACTION] ({state, rootState}, {sdIndex, sideDishId}) {
      const newSideDish = rootState.showOrder.dishIdToSideDishesMap[state.dishId].find(sd => sd.id === sideDishId);
      this.commit(`${NAMESPACE_SHOW_ORDER}/${SET_SIDE_DISH}`, newSideDish);
    },
  }
};
