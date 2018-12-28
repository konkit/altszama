import ApiConnector from "../../lib/ApiConnector";
import DishesApiConnector from "../../lib/DishesApiConnector";

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
    initData (state, payload) {
      state.restaurantId = payload.restaurantId;

      state.name = payload.name;
      state.url = payload.url;
      state.rating = payload.rating;
      state.telephone = payload.telephone;
      state.address = payload.address;
    },
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
    initEditRestaurant(context, {restaurantId}) {
      DishesApiConnector.getRestaurantEditData(restaurantId)
        .then(response => {
          this.commit("editRestaurant/initData", Object.assign(response, {restaurantId: restaurantId}));
          this.commit('setLoadingFalse')
        })
        .catch(errResponse => ApiConnector.handleError(errResponse))
    },
    updateRestaurant({state}, payload) {
      let errorsComponent = payload.errorsComponent;

      const restaurant = {
        name: state.name,
        url: state.url,
        rating: state.rating,
        telephone: state.telephone,
        address: state.address,
      };

      DishesApiConnector.editRestaurant(state.restaurantId, restaurant)
        .catch(error => error.body.messages.forEach(msg => errorsComponent.addError(msg)));
    }
  }
};