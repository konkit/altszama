import ApiConnector from "./ApiConnector";

export default {

  getRestaurants () {
    return ApiConnector.makeGet("/restaurants.json")
      .then(response => {
        return {
          restaurants: response.data.restaurants,
          restaurantToDishesMap: response.data.restaurantToDishesMap
        }
      })
  },

  getShowRestaurantData (restaurantId) {
    return ApiConnector.makeGet("/restaurants/" + restaurantId + "/show.json")
        .then(response => {
          return {
            restaurant: response.data.restaurant,
            dishes: response.data.dishes,
            dishesByCategory: convertToMapEntries(response.data.dishesByCategory)
          }
        })
  },

  createRestaurant (restaurant) {
    const action = "/restaurants/save";

    return ApiConnector.makePost(action, restaurant)
      .then(response => window.location.href = "#/restaurants")
  },

  getRestaurantEditData (restaurantId) {
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

  editRestaurant (restaurantId, restaurant) {
    const action = "/restaurants/update";

    let formData = {
      "restaurant.id": restaurantId,
      id: restaurant.id,
      name: restaurant.name,
      rating: restaurant.rating,
      telephone: restaurant.telephone,
      address: restaurant.address,
      url: restaurant.url
    };

    return ApiConnector.makePost(action, formData)
      .then(response => window.location.href = "#/restaurants/show/" + restaurantId)
  },

  deleteRestaurant (restaurantId) {
    return ApiConnector.makeGet("/restaurants/" + restaurantId + "/delete")
  },

  getDishCreateData (restaurantId) {
    return ApiConnector.makeGet("/restaurants/" + restaurantId + "/dishes/create.json")
  },

  createDish (restaurantId, formData) {
    const action = "/restaurants/" + restaurantId + "/dishes/save";

    return ApiConnector.makePost(action, formData)
  },

  getDishEditData (restaurantId, dishId) {
    return ApiConnector.makeGet("/restaurants/" + restaurantId + "/dishes/" + dishId + "/edit.json")
      .then(response => {
        return {
          name: response.data.dish.name,
          price: response.data.dish.price / 100,
          category: response.data.dish.category,
          initialSideDishes: response.data.dish.sideDishes,
          categories: response.data.categories,
        }
      })
  },

  editDish (restaurantId, dishObj) {
    const action = "/restaurants/" + restaurantId + "/dishes/update"
    const dataSuccessUrl = "#/restaurants/show/" + restaurantId;

    const formData = {
      "restaurant.id": restaurantId,
      id: dishObj.id,
      name: dishObj.name,
      price: dishObj.price,
      category: dishObj.category,
      sideDishes: dishObj.sideDishes
    };

    return ApiConnector.makePost(action, formData)
      .then(response => window.location.href = dataSuccessUrl)
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