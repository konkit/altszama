import Vue from 'vue'
import Vuex from 'vuex'

import AllOrdersState from './modules/AllOrdersState'
import ShowOrderState from './modules/ShowOrderState'
import CreateOrderState from "./modules/CreateOrderState";
import EditOrderState from "./modules/EditOrderState";
import OrderViewState from "./modules/OrderViewState";
import TodayOrdersState from "./modules/TodayOrdersState";
import RestaurantIndexState from "./modules/RestaurantIndexState";
import ShowRestaurantState from "./modules/ShowRestaurantState";
import CreateRestaurantState from "./modules/CreateRestaurantState";
import EditRestaurantState from "./modules/EditRestaurantState";
import CreateDishState from "./modules/CreateDishState";
import EditDishState from "./modules/EditDishState";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loading: false,
    loadingEntry: false,
    username: localStorage.getItem("username"),
    token: localStorage.getItem("token"),
    errors: []
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
      } else {
        state.errors.push(error)
      }
    },
    clearErrorAtIndex (state, index) {
      state.errors.splice(index, 1)
    },
    clearErrors (state) {
      state.errors = []
    }
  },
  modules: {
    // Orders
    showOrder: ShowOrderState,
    allOrders: AllOrdersState,
    createOrder: CreateOrderState,
    editOrder: EditOrderState,
    orderView: OrderViewState,
    todayOrders: TodayOrdersState,

    // Dishes
    restaurantIndex: RestaurantIndexState,
    showRestaurant: ShowRestaurantState,
    createRestaurant: CreateRestaurantState,
    editRestaurant: EditRestaurantState,
    createDish: CreateDishState,
    editDish: EditDishState
  }
})
