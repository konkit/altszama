import ApiConnector from "../../lib/ApiConnector";
import DishesApiConnector from "../../lib/DishesApiConnector";

export const INIT_DATA = "INIT_DATA";
export const UPDATE_NAME = "UPDATE_NAME";
export const UPDATE_URL = "UPDATE_URL";
export const UPDATE_RATING = "UPDATE_RATING";
export const UPDATE_TELEPHONE = "UPDATE_TELEPHONE";
export const UPDATE_ADDRESS = "UPDATE_ADDRESS";

export const INIT_EDIT_RESTAURANT_ACTION = "INIT_EDIT_RESTAURANT_ACTION";
export const UPDATE_RESTAURANT_ACTION = "UPDATE_RESTAURANT_ACTION";

export default {
  namespaced: true,
  state: {
    restaurantId: 0,

    // Restaurant
    name: '',
    url: '',
    rating: '',
    telephone: '',
    address: '',
  },
  mutations: {
    [INIT_DATA] (state, payload) {
      state.restaurantId = payload.restaurantId;

      state.name = payload.name;
      state.url = payload.url;
      state.rating = payload.rating;
      state.telephone = payload.telephone;
      state.address = payload.address;
    },
    [UPDATE_NAME] (state, newValue) {
      state.name = newValue;
    },
    [UPDATE_URL] (state, newValue) {
      state.url = newValue
    },
    [UPDATE_RATING] (state, newValue) {
      state.rating = newValue
    },
    [UPDATE_TELEPHONE] (state, newValue) {
      state.telephone = newValue
    },
    [UPDATE_ADDRESS] (state, newValue) {
      state.address = newValue
    },
  },
  actions: {
    [INIT_EDIT_RESTAURANT_ACTION] (context, {restaurantId}) {
      DishesApiConnector.getRestaurantEditData(restaurantId)
        .then(response => {
          this.commit(`editRestaurant/${INIT_DATA}`, Object.assign(response, {restaurantId: restaurantId}));
          this.commit('setLoadingFalse')

          document.title = `Edit restaurant ${context.state.name} | Alt Szama`
        })
        .catch(errResponse => ApiConnector.handleError(errResponse))
    },
    [UPDATE_RESTAURANT_ACTION] ({state}) {
      const restaurant = {
        id: state.restaurantId,
        name: state.name,
        url: state.url,
        rating: state.rating,
        telephone: state.telephone,
        address: state.address,
      };

      DishesApiConnector.editRestaurant(state.restaurantId, restaurant)
        .catch(errResponse => ApiConnector.handleError(errResponse))
    }
  }
};