import ApiConnector from "../../lib/ApiConnector";
import DishesApiConnector from "../../lib/DishesApiConnector";

export const LOAD_RESTAURANTS = "LOAD_RESTAURANTS";
export const FETCH_ALL_RESTAURANTS = "FETCH_ALL_RESTAURANTS";

export default {
  namespaced: true,
  state: {
    restaurants: [],
    restaurantToDishesMap: {},
  },
  mutations: {
    [LOAD_RESTAURANTS] (state, payload) {
      state.restaurants = payload.restaurants;
      state.restaurantToDishesMap = payload.restaurantToDishesMap;
    }
  },
  actions: {
    [FETCH_ALL_RESTAURANTS] ({state}) {
      DishesApiConnector.getRestaurants()
        .then(response => {
          this.commit(`restaurantIndex/${LOAD_RESTAURANTS}`, response);
          this.commit('setLoadingFalse')

          document.title = `Restaurants | Alt Szama`
        })
        .catch(errResponse => ApiConnector.handleError(errResponse))
    }
  }
};