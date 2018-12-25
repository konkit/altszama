import ApiConnector from "./ApiConnector";

export default {

  getRestaurants: function() {
    return ApiConnector.makeGet("/restaurants.json")
      .then(response => {
        return {
          restaurants: response.data.restaurants,
          restaurantToDishesMap: response.data.restaurantToDishesMap
        }
      })
  },

  getShowRestaurantData: function(restaurantId) {
    return ApiConnector.makeGet("/restaurants/" + restaurantId + "/show.json")
        .then(response => {
          return {
            restaurant: response.data.restaurant,
            dishes: response.data.dishes,
            dishesByCategory: convertToMapEntries(response.data.dishesByCategory)
          }
        })
  },

  createRestaurant: function(restaurant, errorsComponent) {
    const action = "/restaurants/save";

    return ApiConnector.makePost(action, restaurant)
      .then(response => window.location.href = "#/restaurants")
      .catch(error => errorsComponent.addError(error.body.message));
  },

  getRestaurantEditData: function(restaurantId) {
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

  editRestaurant: function(restaurantId, restaurant) {
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

  deleteRestaurant: function(restaurantId) {
    return ApiConnector.makeGet("/restaurants/" + restaurantId + "/delete")
  },

  getDishCreateData: function(restaurantId) {
    return ApiConnector.makeGet("/restaurants/" + restaurantId + "/dishes/create.json")
  },

  createDish: function(restaurantId, formData) {
    const action = "/restaurants/" + restaurantId + "/dishes/save";

    return ApiConnector.makePost(action, formData)
  },

  getDishEditData: function(restaurantId, dishId) {
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

  editDish: function(restaurantId, dishObj) {
    const action = "/restaurants/" + restaurantId + "/dishes/update";

    const formData = {
      "restaurant.id": restaurantId,
      id: dishObj.dishId,
      name: dishObj.name,
      price: dishObj.price,
      category: dishObj.category,
      sideDishes: dishObj.sideDishes
    };

    return ApiConnector.makePost(action, formData)
  },

  deleteDish: function(restaurantId, dishId) {
    return ApiConnector.makeGet("/restaurants/" + restaurantId + "/dishes/" + dishId + "/delete")
  },

  deleteDishEntry: function(orderEntryId, dishEntryId) {
    return ApiConnector.makeGet('/order_entries/' + orderEntryId + '/dish_entry/' + dishEntryId + '/delete')
  },
}

function convertToMapEntries(dishesMap) {
  let result = [];

  for (const key of Object.keys(dishesMap)) {
    result.push({"category": key, "dishes": dishesMap[key]})
  }

  return result;
}