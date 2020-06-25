import ApiConnector from "./ApiConnector";
import router from '../router/index'
import {
  DishControllerApi, DishCreateRequest,
  DishDto, DishUpdateRequest, EditDishResponse,
  EditRestaurantResponse,
  IndexResponse,
  RestaurantControllerApi,
  RestaurantSaveRequest, RestaurantUpdateRequest,
  ShowRestaurantResponse
} from "../frontend-client/api"
import {Configuration} from "@/frontend-client";
import store from "@/store";

function headersWithToken() {
  return { headers: {'Authorization': 'Bearer ' + store.state.token } }
}

export default class DishesApiConnector {

  private static createRestaurantApi () {
    const currentDomain = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
    const backendUrl = process.env.VUE_APP_BACKEND_URL2 || currentDomain;

    const configuration = new Configuration({
      basePath: backendUrl,
      accessToken: store.state.token || ""
    });
    return new RestaurantControllerApi(configuration);
  }

  private static createDishApi() {
    const currentDomain = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
    const backendUrl = process.env.VUE_APP_BACKEND_URL2 || currentDomain;

    const configuration = new Configuration({
      basePath: backendUrl,
      accessToken: store.state.token || ""
    });
    return new DishControllerApi(configuration);
  }

  getRestaurants(): Promise<IndexResponse> {
    const api = DishesApiConnector.createRestaurantApi();

    return api.indexRestaurants(headersWithToken())
      .then(response => {
        return {
          restaurants: response.restaurants,
        }
      })
  }

  getShowRestaurantData (restaurantId: string) {
    const api = DishesApiConnector.createRestaurantApi();

    return api.showRestaurant(restaurantId, headersWithToken())
        // .then(response => {
        //   return {
        //     restaurant: response.restaurant,
        //     dishes: response.dishes,
        //     dishesByCategory: convertToMapEntries(response.dishesByCategory!)
        //   }
        // })
  }

  createRestaurant (restaurant: RestaurantSaveRequest) {
    const api = DishesApiConnector.createRestaurantApi();

    return api.saveRestaurant(restaurant, headersWithToken())

    // return ApiConnector.makePost("/restaurants/save", restaurant)
    //   .then(() => router.push("/restaurants"))
  }

  getRestaurantEditData (restaurantId: string): Promise<EditRestaurantResponse> {
    const api = DishesApiConnector.createRestaurantApi();

    return api.editRestaurant(restaurantId, headersWithToken())

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
  }

  editRestaurant (restaurantId: string, restaurant: RestaurantUpdateRequest) {
    let formData = {
      "restaurant.id": restaurantId,
      id: restaurant.id,
      name: restaurant.name,
      telephone: restaurant.telephone,
      address: restaurant.address,
      url: restaurant.url
    };

    const api = DishesApiConnector.createRestaurantApi();

    return api.updateRestaurant(restaurant, headersWithToken())

    // return ApiConnector.makePost("/restaurants/update", formData)
    //   .then(response => router.push("/restaurants/show/" + restaurantId))
  }

  deleteRestaurant (restaurantId: string) {
    // return ApiConnector.makeGet("/restaurants/" + restaurantId + "/delete")

    const api = DishesApiConnector.createRestaurantApi();

    return api.deleteRestaurant(restaurantId, headersWithToken())
  }

  getDishCreateData (restaurantId: string) {
    // return ApiConnector.makeGet("/restaurants/" + restaurantId + "/dishes/create.json")
    const api = DishesApiConnector.createDishApi();
    return api.createDish(restaurantId, headersWithToken())
  }

  createDish (restaurantId: string, formData: DishCreateRequest) {
    // const action = "/restaurants/" + restaurantId + "/dishes/save";
    //
    // return ApiConnector.makePost(action, formData)

    const api = DishesApiConnector.createDishApi();
    return api.saveDish(restaurantId, formData, headersWithToken())
  }

  getDishEditData (restaurantId: string, dishId: string): Promise<EditDishResponse> {
    // return ApiConnector.makeGet("/restaurants/" + restaurantId + "/dishes/" + dishId + "/edit.json")

    const api = DishesApiConnector.createDishApi();
    return api.editDish(restaurantId, dishId, headersWithToken())

  }

  editDish (restaurantId: string, dishObj: DishUpdateRequest) {
    const formData = {
      "restaurant.id": restaurantId,
      id: dishObj.id,
      name: dishObj.name,
      price: dishObj.price,
      category: dishObj.category,
      sideDishes: dishObj.sideDishes
    };

    // return ApiConnector.makePost("/restaurants/" + restaurantId + "/dishes/update", formData)
    //   .then(response => router.push("/restaurants/show/" + restaurantId))

    const api = DishesApiConnector.createDishApi();
    return api.updateDish(restaurantId, dishObj, headersWithToken())
  }

  deleteDish (restaurantId: string, dishId: string) {
    // return ApiConnector.makeGet("/restaurants/" + restaurantId + "/dishes/" + dishId + "/delete")
    const api = DishesApiConnector.createDishApi();
    return api.deleteDish(dishId, headersWithToken())
  }


}

function convertToMapEntries(dishesMap:  { [key: string]: Array<DishDto>; }) {
  let result = [];

  for (const key of Object.keys(dishesMap)) {
    result.push({"category": key, "dishes": dishesMap[key]})
  }

  return result;
}