import { DishControllerApi, RestaurantControllerApi } from "../frontend-client/api";
import store from "@/store";
import LocalConfiguration from "@/lib/LocalConfiguration";
function headersWithToken() {
    return { headers: { 'Authorization': 'Bearer ' + store.state.token } };
}
var DishesApiConnector = /** @class */ (function () {
    function DishesApiConnector(rootState) {
        this.localConfiguration = new LocalConfiguration(rootState);
        this.configuration = this.localConfiguration.createConfiguration();
        this.restaurantApi = new RestaurantControllerApi(this.configuration);
        this.dishApi = new DishControllerApi(this.configuration);
    }
    DishesApiConnector.prototype.getRestaurants = function () {
        return this.restaurantApi.indexRestaurants(headersWithToken())
            .then(function (response) {
            return {
                restaurants: response.restaurants,
            };
        });
    };
    DishesApiConnector.prototype.getShowRestaurantData = function (restaurantId) {
        return this.restaurantApi.showRestaurant(restaurantId, headersWithToken());
    };
    DishesApiConnector.prototype.createRestaurant = function (restaurant) {
        return this.restaurantApi.saveRestaurant(restaurant, headersWithToken());
    };
    DishesApiConnector.prototype.getRestaurantEditData = function (restaurantId) {
        return this.restaurantApi.editRestaurant(restaurantId, headersWithToken());
    };
    DishesApiConnector.prototype.editRestaurant = function (restaurantId, restaurant) {
        // let formData = {
        //   "restaurant.id": restaurantId,
        //   id: restaurant.id,
        //   name: restaurant.name,
        //   telephone: restaurant.telephone,
        //   address: restaurant.address,
        //   url: restaurant.url
        // };
        return this.restaurantApi.updateRestaurant(restaurant, headersWithToken());
    };
    DishesApiConnector.prototype.deleteRestaurant = function (restaurantId) {
        return this.restaurantApi.deleteRestaurant(restaurantId, headersWithToken());
    };
    DishesApiConnector.prototype.getDishCreateData = function (restaurantId) {
        return this.dishApi.createDish(restaurantId, headersWithToken());
    };
    DishesApiConnector.prototype.createDish = function (restaurantId, formData) {
        return this.dishApi.saveDish(restaurantId, formData, headersWithToken());
    };
    DishesApiConnector.prototype.getDishEditData = function (restaurantId, dishId) {
        return this.dishApi.editDish(restaurantId, dishId, headersWithToken());
    };
    DishesApiConnector.prototype.editDish = function (restaurantId, dishObj) {
        // const formData = {
        //   "restaurant.id": restaurantId,
        //   id: dishObj.id,
        //   name: dishObj.name,
        //   price: dishObj.price,
        //   category: dishObj.category,
        //   sideDishes: dishObj.sideDishes
        // };
        return this.dishApi.updateDish(restaurantId, dishObj, headersWithToken());
    };
    DishesApiConnector.prototype.deleteDish = function (restaurantId, dishId) {
        return this.dishApi.deleteDish(dishId, headersWithToken());
    };
    return DishesApiConnector;
}());
export default DishesApiConnector;
//# sourceMappingURL=DishesApiConnector.js.map