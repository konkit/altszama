import OrdersApiConnector from "../../lib/OrdersApiConnector";
import ApiConnector from "../../lib/ApiConnector";
import DishesApiConnector from "../../lib/DishesApiConnector";

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
    updateName (state, newValue) {
      state.name = newValue;
    },
    updateUrl (state, newValue) {
      state.url = newValue
    },
    updateRating (state, newValue) {
      state.rating = newValue
    },
    updateTelephone (state, newValue) {
      state.telephone = newValue
    },
    updateAddress (state, newValue) {
      state.address = newValue
    },
  },
  actions: {
    saveRestaurant({state}, payload) {
      let errorsComponent = payload.errorsComponent;

      const restaurant = {
        name: state.name,
        url: state.url,
        rating: state.rating,
        telephone: state.telephone,
        address: state.address,
      };

      DishesApiConnector.createRestaurant(restaurant)
        .catch(error => error.body.messages.forEach(msg => errorsComponent.addError(msg)));

      return false;
    }
  },
};