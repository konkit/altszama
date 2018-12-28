import ApiConnector from "../../lib/ApiConnector";
import DishesApiConnector from "../../lib/DishesApiConnector";

export default {
  namespaced: true,
  state: {
    restaurantId: 0,
    categories: [],

    // Dish
    name: '',
    price: '',
    category: ''
  },
  mutations: {
    initData (state, payload) {
      state.restaurantId = payload.restaurantId;
      state.categories = payload.categories;
    },
    updateName (state, newValue) {
      state.name = newValue;
    },
    updatePrice (state, newValue) {
      state.price = newValue
    },
    updateCategory (state, newValue) {
      state.category = newValue
    },
  },
  actions: {
    initCreateDish(context, {restaurantId}) {
      DishesApiConnector.getDishCreateData(restaurantId)
        .then(response => this.commit("createDish/initData", Object.assign(response.data, {restaurantId: restaurantId})))
        .catch(errResponse => ApiConnector.handleError(errResponse))
    },
    saveDish({state}, {errorsComponent, sideDishes, backUrl}) {
      const dish = {
        "restaurant.id": state.restaurantId,
        name: state.name,
        price: Math.round(state.price * 100),
        category: state.category,
        sideDishes: sideDishes
      };

      DishesApiConnector.createDish(state.restaurantId, dish)
        .then(response => window.location.href = backUrl)
        .catch(function (error) {
          errorsComponent.addError(error.body.message);
        });
    }
  },
};