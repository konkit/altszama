import Vue from "vue";
import OrdersApiConnector from "../../lib/OrdersApiConnector";
import ApiConnector from "../../lib/ApiConnector";
import {FETCH_ORDER_DATA_ACTION, NAMESPACE_SHOW_ORDER, ShowOrderState} from "./ShowOrderModule";
import {Module} from "vuex";
import {RootState} from "@/store";
import {SideDishData} from "@/frontend-client";

export const NAMESPACE_MODIFY_ORDER_ENTRY = "modifyOrderEntry";

export const SET_ENTRY_LOADING_TRUE = "SET_ENTRY_LOADING_TRUE";
export const SET_ENTRY_LOADING_FALSE = "SET_ENTRY_LOADING_FALSE";

export const SET_DISH_ENTRY_CREATING = "SET_DISH_ENTRY_CREATING";

export const SET_DISH_ENTRY_EDITING = "SET_DISH_ENTRY_EDITING";
export const SET_DISH_AS_NEW = "SET_DISH_AS_NEW";
export const SET_DISH_AS_EXISTING = "SET_DISH_AS_EXISTING";
export const CANCEL_DISH_ENTRY_MODIFICATION = "CANCEL_DISH_ENTRY_MODIFICATION";

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


export interface ModifyOrderEntryState {
  loadingEntry: boolean,

  isEntryCreating: boolean,
  isEntryEdited: boolean,
  orderEntryId: string,
  dishEntryId: string,

  orderId: string,
  dishId: string,
  additionalComments: string,
  newDish: boolean,
  newDishName: string,
  newDishPrice: number,
  chosenSideDishes: SideDishData[]
}

const modifyOrderEntryState: ModifyOrderEntryState = {
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
  newDishPrice: 0,
  chosenSideDishes: [],
};

export const modifyOrderEntryModule: Module<ModifyOrderEntryState, RootState> = {
  namespaced: true,

  state: modifyOrderEntryState,
  mutations: {
    [SET_ENTRY_LOADING_TRUE] (state) {
      state.loadingEntry = true;
    },
    [SET_ENTRY_LOADING_FALSE] (state) {
      state.loadingEntry = false;
    },

    [SET_DISH_ENTRY_CREATING] (state) {
      state.isEntryCreating = true;
      state.isEntryEdited = false;
      state.orderEntryId = "";
      state.dishEntryId = "";
    },
    [SET_DISH_ENTRY_EDITING] (state, payload) {
      state.isEntryCreating = false;
      state.isEntryEdited = true;
      state.orderEntryId = payload.orderEntryId;
      state.dishEntryId = payload.dishEntryId;
    },
    [CANCEL_DISH_ENTRY_MODIFICATION] (state) {
      state.isEntryCreating = false;
      state.isEntryEdited = false;
      state.orderEntryId = "";
      state.dishEntryId = "";
    },

    [SET_DISH_AS_NEW] (state) {
      state.newDish = true;
      // state.dishId = ""
    },
    [SET_DISH_AS_EXISTING] (state) {
      state.newDish = false;
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
      state.dishId = dishEntry.dishId;
      state.dishEntryId = dishEntry.id;
      state.additionalComments = dishEntry.comments;
      state.newDish = false;
      state.newDishName = "";
      state.newDishPrice = 0;
      state.chosenSideDishes = dishEntry.sideDishes || [];
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

    [ADD_SIDE_DISH] (state, sideDishToAdd: SideDishData) {
      state.chosenSideDishes.push(sideDishToAdd);
    },
    [SET_SIDE_DISH] (state, {sdIndex, newValue}) {
      state.chosenSideDishes[sdIndex] = newValue
    },
    [UPDATE_NEW_SIDE_DISH_NAME] (state, {sdIndex, newValue}) {
      state.chosenSideDishes[sdIndex].newSideDishName = newValue
    },
    [UPDATE_NEW_SIDE_DISH_PRICE] (state, {sdIndex, newValue}) {
      state.chosenSideDishes[sdIndex].newSideDishPrice = newValue
    },
    [SET_SIDE_DISH_AS_NEW] (state, {sdIndex}) {
      Vue.set(state.chosenSideDishes[sdIndex], "isNew", true);
    },
    [SET_SIDE_DISH_AS_EXISTING] (state, {sdIndex}) {
      Vue.set(state.chosenSideDishes[sdIndex], "isNew", false);
    },
    [REMOVE_SIDE_DISH] (state, {sdIndex}) {
      state.chosenSideDishes.splice(sdIndex, 1)
    },
    [CLEAR_EDITED_SIDE_DISHES] (state) {
      state.chosenSideDishes = []
    },
  },
  actions: {
    [SETUP_CREATE_ORDER_ENTRY_ACTION] ({state, rootState}) {
      this.commit('clearErrors');

      const showOrderState = rootState.showOrder as ShowOrderState;

      const orderId = showOrderState.order.id;

      let dishId;
      if (showOrderState.allDishesInRestaurant.length > 0) {
        dishId = showOrderState.allDishesInRestaurant[0].id;
      } else {
        dishId = null
      }

      this.commit(`${NAMESPACE_MODIFY_ORDER_ENTRY}/${SET_INITIAL_CREATED_ORDER_ENTRY}`, {orderId: orderId, dishId: dishId})
    },
    [SETUP_EDIT_ORDER_ENTRY_ACTION] ({state, rootState}, {dishEntry}) {
      this.commit('clearErrors');

      const showOrderState = rootState.showOrder as ShowOrderState;

      const orderId = showOrderState.order.id;

      this.commit(`${NAMESPACE_MODIFY_ORDER_ENTRY}/${SET_INITIAL_EDITED_ORDER_ENTRY}`, {orderId: orderId, dishEntry: dishEntry});
      this.commit(`${NAMESPACE_MODIFY_ORDER_ENTRY}/${SET_ENTRY_LOADING_FALSE}`)
    },
    [SAVE_ORDER_ENTRY_ACTION] ({state, rootState}) {
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

      new OrdersApiConnector(rootState).saveOrderEntry(orderId, orderEntryToSave)
        .then(() => {
          this.commit('setLoadingTrue');
          this.commit(`${NAMESPACE_MODIFY_ORDER_ENTRY}/${CANCEL_DISH_ENTRY_MODIFICATION}`, {});
          this.dispatch(`${NAMESPACE_SHOW_ORDER}/${FETCH_ORDER_DATA_ACTION}`, orderId)
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

      new OrdersApiConnector(rootState).updateOrderEntry(orderId, orderEntryId, orderEntryToUpdate)
        .then(() => {
          this.commit('setLoadingTrue');
          this.commit(`${NAMESPACE_MODIFY_ORDER_ENTRY}/${CANCEL_DISH_ENTRY_MODIFICATION}`, {});
          this.dispatch(`${NAMESPACE_SHOW_ORDER}/${FETCH_ORDER_DATA_ACTION}`, orderId)
        })
        .catch(errResponse => ApiConnector.handleError(errResponse))
    },
    [ADD_SIDE_DISH_ACTION] ({state, rootState}) {
      const showOrderState = rootState.showOrder as ShowOrderState;

      const sideDishesForGivenDish = showOrderState.dishIdToSideDishesMap[state.dishId];
      let sideDishToAdd: SideDishData; // = {};

      if (sideDishesForGivenDish && sideDishesForGivenDish.length > 0) {
        // sideDishToAdd = Object.assign({}, sideDishesForGivenDish[0]);
        // sideDishToAdd.isNew = false

        sideDishToAdd = {isNew: false, newSideDishName: "", newSideDishPrice: 0}
      } else {
        // sideDishToAdd = {};
        // sideDishToAdd.isNew = true

        sideDishToAdd = {isNew: false, newSideDishName: "", newSideDishPrice: 0}
      }

      // sideDishToAdd.newSideDishName = "";
      // sideDishToAdd.newSideDishPrice = 0;

      this.commit(`${NAMESPACE_MODIFY_ORDER_ENTRY}/${ADD_SIDE_DISH}`, sideDishToAdd);
    },
    [UPDATE_SIDE_DISH_ACTION] ({state, rootState}, {sdIndex, sideDishId}) {
      const showOrderState = rootState.showOrder as ShowOrderState;

      const newSideDish = showOrderState.dishIdToSideDishesMap[state.dishId].find(sd => sd.id === sideDishId);
      this.commit(`${NAMESPACE_MODIFY_ORDER_ENTRY}/${SET_SIDE_DISH}`, {sdIndex: sdIndex, newValue: newSideDish});
    },
  },
};
