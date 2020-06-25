import ApiConnector from "../../lib/ApiConnector";
import DishesApiConnector from "../../lib/DishesApiConnector";
import router from "../../router/index"
import {ShowRestaurantResponse} from "@/frontend-client";

export const INIT_RESTAURANT_DATA = "INIT_RESTAURANT_DATA";
export const FETCH_RESTAURANT_ACTION = "FETCH_RESTAURANT_ACTION";
export const DELETE_RESTAURANT_ACTION = "DELETE_RESTAURANT_ACTION";
export const DELETE_DISH_ACTION = "DELETE_DISH_ACTION";

export default {
  namespaced: true,
  state: {
    restaurant: {},
    dishes: [],
    dishesByCategory: [],
  },
  mutations: {
    [INIT_RESTAURANT_DATA] (state, payload: ShowRestaurantResponse) {
      state.restaurant = payload.restaurant;
      state.dishes = payload.dishes;
      state.dishesByCategory = payload.dishesByCategory;
    }
  },
  actions: {
    [FETCH_RESTAURANT_ACTION] (context, {restaurantId}) {
      const connector = new DishesApiConnector();

      connector.getShowRestaurantData(restaurantId)
        .then(response => {
          this.commit(`showRestaurant/${INIT_RESTAURANT_DATA}`, response);
          this.commit('setLoadingFalse');

          document.title = `Restaurant ${context.state.restaurant.name} | Alt Szama`
        })
        .catch(errResponse => ApiConnector.handleError(errResponse))
    },
    [DELETE_RESTAURANT_ACTION] (context, {restaurantId, errorsComponent}) {
      const connector = new DishesApiConnector();

      connector.deleteRestaurant(restaurantId)
        .then(response => router.push({'path': '/restaurants'}))
        .catch(errResponse => ApiConnector.handleError(errResponse))
    },
    [DELETE_DISH_ACTION] (context, {restaurantId, dishId}) {
      const connector = new DishesApiConnector();

      connector.deleteDish(restaurantId, dishId)
        .then(successResponse => {
            this.commit('setLoadingFalse')
            this.dispatch(`showRestaurant/${FETCH_RESTAURANT_ACTION}`, {restaurantId: restaurantId})
        })
        .catch(errResponse => ApiConnector.handleError(errResponse))
    }
  }
};