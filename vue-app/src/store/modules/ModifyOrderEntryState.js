import Vue from "vue";

export const SET_ENTRY_LOADING_TRUE = "SET_ENTRY_LOADING_TRUE";
export const SET_ENTRY_LOADING_FALSE = "SET_ENTRY_LOADING_FALSE";

export const UPDATE_ORDER_ID = "UPDATE_ORDER_ID";
export const UPDATE_DISH_ID = "UPDATE_DISH_ID";
export const UPDATE_ADDITIONAL_COMMENTS = "UPDATE_ADDITIONAL_COMMENTS";
export const UPDATE_NEW_DISH = "UPDATE_EDITED_ORDER_ENTRY_NEW_DISH";
export const UPDATE_NEW_DISH_NAME = "UPDATE_EDITED_ORDER_ENTRY_NEW_DISH_NAME";
export const UPDATE_NEW_DISH_PRICE = "UPDATE_EDITED_ORDER_ENTRY_NEW_DISH_PRICE";
export const UPDATE_CHOSEN_SIDE_DISHES = "UPDATE_CHOSEN_SIDE_DISHES";
export const INIT_EDITED_ORDER = "INIT_EDITED_ORDER";
export const UPDATE_NEW_SIDE_DISH_NAME = "UPDATE_NEW_SIDE_DISH_NAME";
export const UPDATE_NEW_SIDE_DISH_PRICE = "UPDATE_NEW_SIDE_DISH_PRICE";
export const SET_SIDE_DISH = "SET_SIDE_DISH";
export const UPDATE_SIDE_DISH_ACTION = "UPDATE_SIDE_DISH_ACTION";
export const ADD_SIDE_DISH_ACTION = "ADD_SIDE_DISH_ACTION";
export const SET_SIDE_DISH_AS_NEW = "SET_SIDE_DISH_AS_NEW";
export const SET_SIDE_DISH_AS_EXISTING = "SET_SIDE_DISH_AS_EXISTING";
export const REMOVE_SIDE_DISH = "REMOVE_SIDE_DISH";


export default {
  namespaced: true,
  state: {
    loadingEntry: false,

    orderId: '',
    dishId: '',
    additionalComments: '',
    newDish: false,
    newDishName: "",
    newDishPrice: "",
    chosenSideDishes: []
  },
  getters: {
    editedOrderEntry (state) {
      return {
        orderId: state.orderId,
        dishId: state.dishId,
        additionalComments: state.additionalComments,
        newDish: state.newDish,
        newDishName: state.newDishName,
        newDishPrice: state.newDishPrice,
        chosenSideDishes: state.chosenSideDishes
      }
    }
  },
  mutations: {
    [UPDATE_ORDER_ID] (state, newValue) {
      state.orderId = newValue;
    },
    [UPDATE_DISH_ID] (state, newValue) {
      state.dishId = newValue;
    },
    [UPDATE_ADDITIONAL_COMMENTS] (state, newValue) {
      state.additionalCommentsd = newValue;
    },
    [UPDATE_NEW_DISH] (state, newValue) {
      state.newDish = newValue;
    },
    [UPDATE_NEW_DISH_NAME] (state, newValue) {
      state.newDishName = newValue;
    },
    [UPDATE_NEW_DISH_PRICE] (state, newValue) {
      state.newDishPrice = newValue;
    },
    [UPDATE_CHOSEN_SIDE_DISHES] (state, newValue) {
      state.newDishPrice = newValue;
    },
    [SET_ENTRY_LOADING_TRUE] (state) {
      state.loadingEntry = true;
    },
    [SET_ENTRY_LOADING_FALSE] (state) {
      state.loadingEntry = false;
    },
    [INIT_EDITED_ORDER] (state, payload) {
      state.orderId = payload.orderId;
      state.dishId = payload.dishId;
      state.additionalComments = payload.additionalComments;
      state.newDish = payload.newDish;
      state.newDishName = payload.newDishName;
      state.newDishPrice = payload.newDishPrice;
      state.chosenSideDishes = payload.chosenSideDishes;
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
    [REMOVE_SIDE_DISH] (state, {sdIndex}) {
      state.chosenSideDishes.splice(sdIndex, 1)
    }
  },
  actions: {
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

      state.chosenSideDishes.push(sideDishToAdd);
    },
    [UPDATE_SIDE_DISH_ACTION] ({state, rootState}, {sdIndex, sideDishId}) {
      const newSideDish = rootState.showOrder.dishIdToSideDishesMap[state.dishId].find(sd => sd.id === sideDishId);
      this.commit(`showOrder/${SET_SIDE_DISH}`, newSideDish);
    },
  }
};
