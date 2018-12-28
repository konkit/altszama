import ApiConnector from "../../lib/ApiConnector";
import DishesApiConnector from "../../lib/DishesApiConnector";

export default {
  namespaced: true,
  state: {
    restaurantId: 0,
    dishId: 0,

    categories: [],
    initialSideDishes: [],

    // Dish
    name: '',
    price: '',
    category: '',
  },
  mutations: {
    initData (state, payload) {

      state.restaurantId = payload.restaurantId;
      state.dishId = payload.dishId;

      state.name = payload.name;
      state.price = payload.price;
      state.category = payload.category;
      state.initialSideDishes = payload.initialSideDishes;
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
    initEditDish(context, {restaurantId, dishId}) {
      DishesApiConnector.getDishEditData(restaurantId, dishId)
        .then(dishData => {
          this.commit("editDish/initData", Object.assign(dishData, {restaurantId: restaurantId, dishId: dishId}));
          this.commit('setLoadingFalse')
        })
        .catch(errResponse => ApiConnector.handleError(errResponse))
    },
    updateDish({state}, {errorsComponent, sideDishes}) {
      const dishObj = {
        id: state.dishId,
        name: state.name,
        price: Math.round(state.price * 100),
        category: state.category,
        sideDishes: sideDishes
      };

      DishesApiConnector.editDish(state.restaurantId, dishObj)
        .catch(error => errorsComponent.addError(error.body.message));
    }
  }
};