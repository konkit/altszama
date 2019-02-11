import ApiConnector from "../../lib/ApiConnector";
import DishesApiConnector from "../../lib/DishesApiConnector";
import router from '../../router/index'

export const INIT_DATA = "INIT_DATA";
export const UPDATE_NAME = "UPDATE_NAME";
export const UPDATE_PRICE = "UPDATE_PRICE";
export const UPDATE_CATEGORY = "UPDATE_CATEGORY";

export const INIT_ACTION = "INIT_ACTION";
export const SAVE_DISH_ACTION = "SAVE_DISH_ACTION";

export default {
  namespaced: true,
  state: {
    restaurantId: 0,
    categories: [],

    // Dish
    name: '',
    price: 0,
    category: ''
  },
  mutations: {
    [INIT_DATA] (state, payload) {
      state.restaurantId = payload.restaurantId;
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
    [INIT_ACTION] (context, {restaurantId}) {
      DishesApiConnector.getDishCreateData(restaurantId)
        .then(response => this.commit(`createDish/${INIT_DATA}`, Object.assign(response.data, {restaurantId: restaurantId})))
        .catch(errResponse => ApiConnector.handleError(errResponse))
    },
    [SAVE_DISH_ACTION] ({state}, {sideDishes, backUrl}) {
      const dish = {
        "restaurant.id": state.restaurantId,
        name: state.name,
        price: state.price,
        category: state.category,
        sideDishes: sideDishes
      };

      DishesApiConnector.createDish(state.restaurantId, dish)
        .then(response => router.push(backUrl))
        .catch(errResponse => ApiConnector.handleError(errResponse))
    }
  },
};