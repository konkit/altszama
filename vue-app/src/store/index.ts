import Vue from 'vue'
import Vuex from 'vuex'

import ShowOrderState from './modules/ShowOrderState'
import CreateOrderState from "./modules/CreateOrderState";
import EditOrderState from "./modules/EditOrderState";
import OrderViewState from "./modules/OrderViewState";
import TodayOrdersState from "./modules/TodayOrdersState";
import ShowRestaurantState from "./modules/ShowRestaurantState";
import ModifyOrderEntryState from "./modules/ModifyOrderEntryState";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loading: false,
    username: localStorage.getItem("username"),
    token: localStorage.getItem("token"),
    errors: [],
    masterNavDrawerOpened: null,
  },
  mutations: {
    setLoadingTrue (state) {
      state.loading = true;
    },
    setLoadingFalse (state) {
      state.loading = false;
    },
    loginUser (state, payload) {
      state.username = payload.username;
      localStorage.setItem("username", payload.username);

      state.token = payload.token;
      localStorage.setItem("token", payload.token)
    },
    logoutUser (state) {
      state.username = "";
      localStorage.setItem("username", "");

      state.token = "";
      localStorage.setItem("token", "");
    },
    addError (state, error) {
      if (error instanceof Array) {
        error.forEach(errorStr => state.errors.push(errorStr));
      } else if (typeof error == 'object' && typeof error.exception !== "undefined") {
        state.errors.push("Error: " + error.exception + " occured!");
      } else if (typeof error == 'object' && typeof error.message !== "undefined") {
        state.errors.push(error.message)
      } else if (typeof error == 'object' && typeof error.body.message !== "undefined") {
        state.errors.push(error.body.message)
      } else if (typeof error == 'object' && typeof error.body.messages !== "undefined") {
        error.body.messages.forEach(errorStr => state.errors.push(errorStr));
      } else {
        state.errors.push(error)
      }
    },
    clearErrorAtIndex (state, index) {
      state.errors.splice(index, 1)
    },
    clearErrors (state) {
      state.errors = []
    },
    setMasterNavigationDrawerOpened (state, value) {
      state.masterNavDrawerOpened = value
    },
    toggleMasterNavigationDrawerOpened (state) {
      state.masterNavDrawerOpened = !state.masterNavDrawerOpened
    }
  },
  modules: {
    // Orders
    showOrder: ShowOrderState,
    createOrder: CreateOrderState,
    editOrder: EditOrderState,
    orderView: OrderViewState,
    todayOrders: TodayOrdersState,
    modifyOrderEntry: ModifyOrderEntryState,

    // Dishes
    showRestaurant: ShowRestaurantState,
  }
})
