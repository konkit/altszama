import OrdersApiConnector from "../../lib/OrdersApiConnector";
import ApiConnector from "../../lib/ApiConnector";
import DishesApiConnector from "../../lib/DishesApiConnector";
import router from "../../router/index"

export default {
  namespaced: true,
  state: {
    restaurant: {},
    dishes: [],
    dishesByCategory: {},
  },
  mutations: {
    initRestaurantData(state, payload) {
      state.restaurant = payload.restaurant;
      state.dishes = payload.dishes;
      state.dishesByCategory = payload.dishesByCategory;
    }
  },
  actions: {
    fetchRestaurant(context, {restaurantId}) {
      DishesApiConnector.getShowRestaurantData(restaurantId)
        .then(response => {
          this.commit("showRestaurant/initRestaurantData", response);
          this.commit('setLoadingFalse')
        })
        .catch(errResponse => ApiConnector.handleError(errResponse))
    },
    deleteRestaurant(context, {restaurantId, errorsComponent}) {
      DishesApiConnector.deleteRestaurant(restaurantId)
        .then(response => router.push({'path': '/restaurants'}))
        .catch(error => {
          errorsComponent.addError2(error);
          ApiConnector.handleError(error);
        });
    },
    deleteDish(context, {restaurantId, dishId}) {
      DishesApiConnector.deleteDish(restaurantId, dishId)
        .then(successResponse => window.location.reload())
        .catch(errResponse => console.log(errResponse));
    }
  }
};