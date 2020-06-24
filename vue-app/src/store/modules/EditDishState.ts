import ApiConnector from "../../lib/ApiConnector";
import DishesApiConnector from "../../lib/DishesApiConnector";

export const INIT_DATA = "INIT_DATA";
export const UPDATE_NAME = "UPDATE_NAME";
export const UPDATE_PRICE = "UPDATE_PRICE";
export const UPDATE_CATEGORY = "UPDATE_CATEGORY";

export const INIT_EDIT_DISH_ACTION = "INIT_EDIT_DISH_ACTION";
export const UPDATE_DISH_ACTION = "UPDATE_DISH_ACTION";


export default {
  namespaced: true,
  state: {
    restaurantId: 0,
    dishId: 0,

    categories: [],
    initialSideDishes: [],

    // Dish
    name: '',
    price: 0,
    category: '',
  },
  mutations: {
    [INIT_DATA] (state, payload) {
      state.restaurantId = payload.restaurantId;
      state.dishId = payload.dishId;

      state.name = payload.name;
      state.price = payload.price;
      state.category = payload.category;
      state.initialSideDishes = payload.initialSideDishes;
      state.categories = payload.categories;
    },
    [UPDATE_NAME] (state, newValue) {
      state.name = newValue;
    },
    [UPDATE_PRICE] (state, newValue) {
      state.price = newValue
    },
    [UPDATE_CATEGORY] (state, newValue) {
      state.category = newValue
    },
  },
  actions: {
    [INIT_EDIT_DISH_ACTION] (context, {restaurantId, dishId}) {
      DishesApiConnector.getDishEditData(restaurantId, dishId)
        .then(dishData => {
          this.commit(`editDish/${INIT_DATA}`, Object.assign(dishData, {restaurantId: restaurantId, dishId: dishId}));
          this.commit('setLoadingFalse')

          document.title = `Edit dish | Alt Szama`
        })
        .catch(errResponse => ApiConnector.handleError(errResponse))
    },
    [UPDATE_DISH_ACTION] ({state}, {sideDishes}) {
      const dishObj = {
        id: state.dishId,
        name: state.name,
        price: state.price,
        category: state.category,
        sideDishes: sideDishes
      };

      DishesApiConnector.editDish(state.restaurantId, dishObj)
        .catch(errResponse => ApiConnector.handleError(errResponse))
    }
  }
};