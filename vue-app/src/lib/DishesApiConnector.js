import { DishControllerApi, RestaurantControllerApi } from "../frontend-client/api";
import { Configuration } from "@/frontend-client";
import store from "@/store";
function headersWithToken() {
    return { headers: { 'Authorization': 'Bearer ' + store.state.token } };
}
var DishesApiConnector = /** @class */ (function () {
    function DishesApiConnector() {
    }
    DishesApiConnector.createRestaurantApi = function () {
        var currentDomain = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
        var backendUrl = process.env.VUE_APP_BACKEND_URL2 || currentDomain;
        var configuration = new Configuration({
            basePath: backendUrl,
            accessToken: store.state.token || ""
        });
        return new RestaurantControllerApi(configuration);
    };
    DishesApiConnector.createDishApi = function () {
        var currentDomain = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
        var backendUrl = process.env.VUE_APP_BACKEND_URL2 || currentDomain;
        var configuration = new Configuration({
            basePath: backendUrl,
            accessToken: store.state.token || ""
        });
        return new DishControllerApi(configuration);
    };
    DishesApiConnector.prototype.getRestaurants = function () {
        var api = DishesApiConnector.createRestaurantApi();
        return api.indexRestaurants(headersWithToken())
            .then(function (response) {
            return {
                restaurants: response.restaurants,
            };
        });
    };
    DishesApiConnector.prototype.getShowRestaurantData = function (restaurantId) {
        var api = DishesApiConnector.createRestaurantApi();
        return api.showRestaurant(restaurantId, headersWithToken());
        // .then(response => {
        //   return {
        //     restaurant: response.restaurant,
        //     dishes: response.dishes,
        //     dishesByCategory: convertToMapEntries(response.dishesByCategory!)
        //   }
        // })
    };
    DishesApiConnector.prototype.createRestaurant = function (restaurant) {
        var api = DishesApiConnector.createRestaurantApi();
        return api.saveRestaurant(restaurant, headersWithToken());
        // return ApiConnector.makePost("/restaurants/save", restaurant)
        //   .then(() => router.push("/restaurants"))
    };
    DishesApiConnector.prototype.getRestaurantEditData = function (restaurantId) {
        var api = DishesApiConnector.createRestaurantApi();
        return api.editRestaurant(restaurantId, headersWithToken());
        // return ApiConnector.makeGet("/restaurants/" + restaurantId + "/edit.json")
        //   .then(response => {
        //     return {
        //       id: response.data.id,
        //       url: response.data.url,
        //       name: response.data.name,
        //       rating: response.data.rating,
        //       telephone: response.data.telephone,
        //       address: response.data.address
        //     }
        //   })
    };
    DishesApiConnector.prototype.editRestaurant = function (restaurantId, restaurant) {
        var formData = {
            "restaurant.id": restaurantId,
            id: restaurant.id,
            name: restaurant.name,
            telephone: restaurant.telephone,
            address: restaurant.address,
            url: restaurant.url
        };
        var api = DishesApiConnector.createRestaurantApi();
        return api.updateRestaurant(restaurant, headersWithToken());
        // return ApiConnector.makePost("/restaurants/update", formData)
        //   .then(response => router.push("/restaurants/show/" + restaurantId))
    };
    DishesApiConnector.prototype.deleteRestaurant = function (restaurantId) {
        // return ApiConnector.makeGet("/restaurants/" + restaurantId + "/delete")
        var api = DishesApiConnector.createRestaurantApi();
        return api.deleteRestaurant(restaurantId, headersWithToken());
    };
    DishesApiConnector.prototype.getDishCreateData = function (restaurantId) {
        // return ApiConnector.makeGet("/restaurants/" + restaurantId + "/dishes/create.json")
        var api = DishesApiConnector.createDishApi();
        return api.createDish(restaurantId, headersWithToken());
    };
    DishesApiConnector.prototype.createDish = function (restaurantId, formData) {
        // const action = "/restaurants/" + restaurantId + "/dishes/save";
        //
        // return ApiConnector.makePost(action, formData)
        var api = DishesApiConnector.createDishApi();
        return api.saveDish(restaurantId, formData, headersWithToken());
    };
    DishesApiConnector.prototype.getDishEditData = function (restaurantId, dishId) {
        // return ApiConnector.makeGet("/restaurants/" + restaurantId + "/dishes/" + dishId + "/edit.json")
        var api = DishesApiConnector.createDishApi();
        return api.editDish(restaurantId, dishId, headersWithToken());
    };
    DishesApiConnector.prototype.editDish = function (restaurantId, dishObj) {
        var formData = {
            "restaurant.id": restaurantId,
            id: dishObj.id,
            name: dishObj.name,
            price: dishObj.price,
            category: dishObj.category,
            sideDishes: dishObj.sideDishes
        };
        // return ApiConnector.makePost("/restaurants/" + restaurantId + "/dishes/update", formData)
        //   .then(response => router.push("/restaurants/show/" + restaurantId))
        var api = DishesApiConnector.createDishApi();
        return api.updateDish(restaurantId, dishObj, headersWithToken());
    };
    DishesApiConnector.prototype.deleteDish = function (restaurantId, dishId) {
        // return ApiConnector.makeGet("/restaurants/" + restaurantId + "/dishes/" + dishId + "/delete")
        var api = DishesApiConnector.createDishApi();
        return api.deleteDish(dishId, headersWithToken());
    };
    return DishesApiConnector;
}());
export default DishesApiConnector;
function convertToMapEntries(dishesMap) {
    var result = [];
    for (var _i = 0, _a = Object.keys(dishesMap); _i < _a.length; _i++) {
        var key = _a[_i];
        result.push({ "category": key, "dishes": dishesMap[key] });
    }
    return result;
}
//# sourceMappingURL=DishesApiConnector.js.map