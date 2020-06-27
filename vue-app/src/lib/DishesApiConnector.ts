import {
  DishControllerApi,
  DishCreateRequest,
  DishUpdateRequest,
  EditDishResponse,
  EditRestaurantResponse,
  IndexResponse,
  RestaurantControllerApi,
  RestaurantSaveRequest,
  RestaurantUpdateRequest
} from "../frontend-client/api"
import store, {RootState} from "@/store";
import LocalConfiguration from "@/lib/LocalConfiguration";
import {Store} from "vuex";
import {Configuration} from "@/frontend-client";

function headersWithToken() {
  return { headers: {'Authorization': 'Bearer ' + store.state.token } }
}

export default class DishesApiConnector {

  private localConfiguration: LocalConfiguration;
  private configuration: Configuration;
  private readonly restaurantApi: RestaurantControllerApi;
  private readonly dishApi: DishControllerApi;

  constructor(rootState: RootState) {
    this.localConfiguration = new LocalConfiguration(rootState);
    this.configuration = this.localConfiguration.createConfiguration();
    this.restaurantApi = new RestaurantControllerApi(this.configuration);
    this.dishApi = new DishControllerApi(this.configuration);
  }

  getRestaurants(): Promise<IndexResponse> {
    return this.restaurantApi.indexRestaurants(headersWithToken())
      .then(response => {
        return {
          restaurants: response.restaurants,
        }
      })
  }

  getShowRestaurantData (restaurantId: string) {
    return this.restaurantApi.showRestaurant(restaurantId, headersWithToken())
  }

  createRestaurant (restaurant: RestaurantSaveRequest) {
    return this.restaurantApi.saveRestaurant(restaurant, headersWithToken())
  }

  getRestaurantEditData (restaurantId: string): Promise<EditRestaurantResponse> {
    return this.restaurantApi.editRestaurant(restaurantId, headersWithToken())
  }

  editRestaurant (restaurantId: string, restaurant: RestaurantUpdateRequest) {
    // let formData = {
    //   "restaurant.id": restaurantId,
    //   id: restaurant.id,
    //   name: restaurant.name,
    //   telephone: restaurant.telephone,
    //   address: restaurant.address,
    //   url: restaurant.url
    // };

    return this.restaurantApi.updateRestaurant(restaurant, headersWithToken())
  }

  deleteRestaurant (restaurantId: string) {
    return this.restaurantApi.deleteRestaurant(restaurantId, headersWithToken())
  }

  getDishCreateData (restaurantId: string) {
    return this.dishApi.createDish(restaurantId, headersWithToken())
  }

  createDish (restaurantId: string, formData: DishCreateRequest) {
    return this.dishApi.saveDish(restaurantId, formData, headersWithToken())
  }

  getDishEditData (restaurantId: string, dishId: string): Promise<EditDishResponse> {
    return this.dishApi.editDish(restaurantId, dishId, headersWithToken())
  }

  editDish (restaurantId: string, dishObj: DishUpdateRequest) {
    // const formData = {
    //   "restaurant.id": restaurantId,
    //   id: dishObj.id,
    //   name: dishObj.name,
    //   price: dishObj.price,
    //   category: dishObj.category,
    //   sideDishes: dishObj.sideDishes
    // };

    return this.dishApi.updateDish(restaurantId, dishObj, headersWithToken())
  }

  deleteDish (restaurantId: string, dishId: string) {
    return this.dishApi.deleteDish(dishId, headersWithToken())
  }
}