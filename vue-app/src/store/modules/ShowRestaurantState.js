var _a, _b;
import ApiConnector from "../../lib/ApiConnector";
import DishesApiConnector from "../../lib/DishesApiConnector";
import router from "../../router/index";
export var INIT_RESTAURANT_DATA = "INIT_RESTAURANT_DATA";
export var FETCH_RESTAURANT_ACTION = "FETCH_RESTAURANT_ACTION";
export var DELETE_RESTAURANT_ACTION = "DELETE_RESTAURANT_ACTION";
export var DELETE_DISH_ACTION = "DELETE_DISH_ACTION";
export default {
    namespaced: true,
    state: {
        restaurant: {},
        dishes: [],
        dishesByCategory: [],
    },
    mutations: (_a = {},
        _a[INIT_RESTAURANT_DATA] = function (state, payload) {
            state.restaurant = payload.restaurant;
            state.dishes = payload.dishes;
            state.dishesByCategory = payload.dishesByCategory;
        },
        _a),
    actions: (_b = {},
        _b[FETCH_RESTAURANT_ACTION] = function (context, _a) {
            var _this = this;
            var restaurantId = _a.restaurantId;
            var connector = new DishesApiConnector();
            connector.getShowRestaurantData(restaurantId)
                .then(function (response) {
                _this.commit("showRestaurant/" + INIT_RESTAURANT_DATA, response);
                _this.commit('setLoadingFalse');
                document.title = "Restaurant " + context.state.restaurant.name + " | Alt Szama";
            })
                .catch(function (errResponse) { return ApiConnector.handleError(errResponse); });
        },
        _b[DELETE_RESTAURANT_ACTION] = function (context, _a) {
            var restaurantId = _a.restaurantId, errorsComponent = _a.errorsComponent;
            var connector = new DishesApiConnector();
            connector.deleteRestaurant(restaurantId)
                .then(function (response) { return router.push({ 'path': '/restaurants' }); })
                .catch(function (errResponse) { return ApiConnector.handleError(errResponse); });
        },
        _b[DELETE_DISH_ACTION] = function (context, _a) {
            var _this = this;
            var restaurantId = _a.restaurantId, dishId = _a.dishId;
            var connector = new DishesApiConnector();
            connector.deleteDish(restaurantId, dishId)
                .then(function (successResponse) {
                _this.commit('setLoadingFalse');
                _this.dispatch("showRestaurant/" + FETCH_RESTAURANT_ACTION, { restaurantId: restaurantId });
            })
                .catch(function (errResponse) { return ApiConnector.handleError(errResponse); });
        },
        _b)
};
//# sourceMappingURL=ShowRestaurantState.js.map