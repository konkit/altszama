import ApiConnector from "./ApiConnector";
import router from '../router/index'
import {EditRestaurantResponse, IndexResponse, RestaurantSaveRequest, ShowResponse} from "@/lib/model";



export default {

  getRestaurants (): Promise<IndexResponse> {
    return ApiConnector.makeGet("/restaurants.json")
      .then(response => {
        return {
          restaurants: response.data.restaurants,
        }
      })
  },

  getShowRestaurantData (restaurantId): Promise<ShowResponse> {
    return ApiConnector.makeGet("/restaurants/" + restaurantId + "/show.json")
        .then(response => {
          return {
            restaurant: response.data.restaurant,
            dishes: response.data.dishes,
            dishesByCategory: convertToMapEntries(response.data.dishesByCategory)
          }
        })
  },

  createRestaurant (restaurant: RestaurantSaveRequest) {
    return ApiConnector.makePost("/restaurants/save", restaurant)
      .then(() => router.push("/restaurants"))
  },

  getRestaurantEditData (restaurantId): Promise<EditRestaurantResponse> {
    return ApiConnector.makeGet("/restaurants/" + restaurantId + "/edit.json")
      .then(response => {
        return {
          id: response.data.id,
          url: response.data.url,
          name: response.data.name,
          rating: response.data.rating,
          telephone: response.data.telephone,
          address: response.data.address
        }
      })
  },

  editRestaurant (restaurantId, restaurant: RestaurantUpdateRequest) {
    let formData = {
      "restaurant.id": restaurantId,
      id: restaurant.id,
      name: restaurant.name,
      rating: restaurant.rating,
      telephone: restaurant.telephone,
      address: restaurant.address,
      url: restaurant.url
    };

    return ApiConnector.makePost("/restaurants/update", formData)
      .then(response => router.push("/restaurants/show/" + restaurantId))
  },

  deleteRestaurant (restaurantId) {
    return ApiConnector.makeGet("/restaurants/" + restaurantId + "/delete")
  },

  getDishCreateData (restaurantId): Promise<DishCreateResponse> {
    return ApiConnector.makeGet("/restaurants/" + restaurantId + "/dishes/create.json")
  },

  createDish (restaurantId, formData: DishCreateRequest) {
    const action = "/restaurants/" + restaurantId + "/dishes/save";

    return ApiConnector.makePost(action, formData)
  },

  getDishEditData (restaurantId, dishId): Promise<EditDishResponse> {
    return ApiConnector.makeGet("/restaurants/" + restaurantId + "/dishes/" + dishId + "/edit.json")
  },

  editDish (restaurantId, dishObj: DishUpdateRequest) {
    const formData = {
      "restaurant.id": restaurantId,
      id: dishObj.id,
      name: dishObj.name,
      price: dishObj.price,
      category: dishObj.category,
      sideDishes: dishObj.sideDishes
    };

    return ApiConnector.makePost("/restaurants/" + restaurantId + "/dishes/update", formData)
      .then(response => router.push("/restaurants/show/" + restaurantId))
  },

  deleteDish (restaurantId, dishId) {
    return ApiConnector.makeGet("/restaurants/" + restaurantId + "/dishes/" + dishId + "/delete")
  },


}

function convertToMapEntries(dishesMap) {
  let result = [];

  for (const key of Object.keys(dishesMap)) {
    result.push({"category": key, "dishes": dishesMap[key]})
  }

  return result;
}