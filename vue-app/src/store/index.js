import Vue from 'vue'
import Vuex from 'vuex'

import AllOrdersState from './modules/AllOrdersState'
import ShowOrderState from './modules/ShowOrderState'
import CreateOrderState from "./modules/CreateOrderState";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loading: false,
    loadingEntry: false,
    username: localStorage.getItem("username"),
    token: localStorage.getItem("token"),
  },
  mutations: {
    setLoadingTrue (state) {
      state.loading = true;
    },
    setLoadingFalse (state) {
      state.loading = false;
    },
    setEntryLoadingTrue (state) {
      state.loadingEntry = true;
    },
    setEntryLoadingFalse (state) {
      state.loadingEntry = false;
    },
    loginUser (state, payload) {
      state.username = payload.username;
      localStorage.setItem("username", payload.username);

      state.token = payload.token;
      localStorage.setItem("token", payload.token)
    },
    logoutUser (state, payload) {
      state.username = "";
      localStorage.setItem("username", "");

      state.token = "";
      localStorage.setItem("token", "");
    },
  },
  modules: {
    showOrder: ShowOrderState,
    allOrders: AllOrdersState,
    createOrder: CreateOrderState,
  }
})
