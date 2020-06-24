import ApiConnector from "../../lib/ApiConnector";
import DishesApiConnector from "../../lib/DishesApiConnector";

export const UPDATE_NAME = "UPDATE_NAME";
export const UPDATE_URL = "UPDATE_URL";
export const UPDATE_RATING = "UPDATE_RATING";
export const UPDATE_TELEPHONE = "UPDATE_TELEPHONE";
export const UPDATE_ADDRESS = "UPDATE_ADDRESS";

export const INIT_CREATE_RESTAURANT_ACTION = "INIT_CREATE_RESTAURANT_ACTION";
export const SAVE_RESTAURANT_ACTION = "SAVE_RESTAURANT_ACTION";

export default {
  namespaced: true,
  state: {
    // Restaurant
    name: '',
    url: '',
    rating: '',
    telephone: '',
    address: '',
  },
  mutations: {
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
    [INIT_CREATE_RESTAURANT_ACTION] () {
        document.title = `Create restaurant | Alt Szama`
    },
    [SAVE_RESTAURANT_ACTION] ({state}) {
      const restaurant = {
        name: state.name,
        url: state.url,
        rating: state.rating,
        telephone: state.telephone,
        address: state.address,
      };

      DishesApiConnector.createRestaurant(restaurant)
        .catch(errResponse => ApiConnector.handleError(errResponse));

      return false;
    }
  },
};