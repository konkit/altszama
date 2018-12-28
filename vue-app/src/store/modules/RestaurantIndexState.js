import ApiConnector from "../../lib/ApiConnector";
import DishesApiConnector from "../../lib/DishesApiConnector";

export default {
  namespaced: true,
  state: {
    restaurants: [],
    restaurantToDishesMap: {},
  },
  mutations: {
    loadRestaurants(state, payload) {
      state.restaurants = payload.restaurants;
      state.restaurantToDishesMap = payload.restaurantToDishesMap;
    }
  },
  actions: {
    fetchAllRestaurants({state}) {
      DishesApiConnector.getRestaurants()
        .then(response => {
          this.commit("restaurantIndex/loadRestaurants", response);
          this.commit('setLoadingFalse')
        })
        .catch(errResponse => ApiConnector.handleError(errResponse))
    }
  }
};