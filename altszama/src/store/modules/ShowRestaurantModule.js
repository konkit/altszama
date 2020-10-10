var _a, _b;
import ApiConnector from "../../lib/ApiConnector";
import DishesApiConnector from "../../lib/DishesApiConnector";
import router from "../../router/index";
export var INIT_RESTAURANT_DATA = "INIT_RESTAURANT_DATA";
export var FETCH_RESTAURANT_ACTION = "FETCH_RESTAURANT_ACTION";
export var DELETE_RESTAURANT_ACTION = "DELETE_RESTAURANT_ACTION";
export var DELETE_DISH_ACTION = "DELETE_DISH_ACTION";
export var showRestaurantState = {
    restaurant: {
        id: "",
        name: "",
        url: "",
        telephone: "",
        address: ""
    },
    dishes: [],
    dishesByCategory: {},
};
export var showRestaurantModule = {
    namespaced: true,
    state: showRestaurantState,
    mutations: (_a = {},
        _a[INIT_RESTAURANT_DATA] = function (state, payload) {
            state.restaurant = payload.restaurant;
            state.dishes = payload.dishes;
            state.dishesByCategory = payload.dishesByCategory;
        },
        _a),
    actions: (_b = {},
        _b[FETCH_RESTAURANT_ACTION] = function (_a, _b) {
            var _this = this;
            var state = _a.state, rootState = _a.rootState;
            var restaurantId = _b.restaurantId;
            var connector = new DishesApiConnector(rootState);
            connector.getShowRestaurantData(restaurantId)
                .then(function (response) {
                _this.commit("showRestaurant/" + INIT_RESTAURANT_DATA, response);
                _this.commit('setLoadingFalse');
                document.title = "Restaurant " + state.restaurant.name + " | Alt Szama";
            })
                .catch(function (errResponse) { return ApiConnector.handleError(errResponse); });
        },
        _b[DELETE_RESTAURANT_ACTION] = function (_a, _b) {
            var state = _a.state, rootState = _a.rootState;
            var restaurantId = _b.restaurantId, errorsComponent = _b.errorsComponent;
            var connector = new DishesApiConnector(rootState);
            connector.deleteRestaurant(restaurantId)
                .then(function (response) { return router.push({ 'path': '/restaurants' }); })
                .catch(function (errResponse) { return ApiConnector.handleError(errResponse); });
        },
        _b[DELETE_DISH_ACTION] = function (_a, _b) {
            var _this = this;
            var state = _a.state, rootState = _a.rootState;
            var restaurantId = _b.restaurantId, dishId = _b.dishId;
            var connector = new DishesApiConnector(rootState);
            connector.deleteDish(restaurantId, dishId)
                .then(function (successResponse) {
                _this.dispatch("showRestaurant/" + FETCH_RESTAURANT_ACTION, { restaurantId: restaurantId });
                _this.commit('setLoadingFalse');
            })
                .catch(function (errResponse) { return ApiConnector.handleError(errResponse); });
        },
        _b)
};
//# sourceMappingURL=ShowRestaurantModule.js.map