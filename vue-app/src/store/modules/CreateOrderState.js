import {mapMutations} from "vuex";

export default {
  namespaced: true,
  state: {
    restaurantsList: [],
    order: {},
  },
  mutations: {
    initData (state, payload) {
      state.restaurantsList = payload.restaurantsList;
      state.order = payload.order;
    },
    updateOrder (state, newOrder) {
      state.order = newOrder;
    },
  },
};