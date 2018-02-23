package altszama.restaurantImport

import altszama.dish.Dish
import altszama.dish.DishRepository
import altszama.dish.SideDish
import altszama.restaurant.Restaurant
import altszama.restaurant.RestaurantRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service


@Service
class RestaurantImportService {

  @Autowired
  private lateinit var restaurantRepository: RestaurantRepository

  @Autowired
  private lateinit var dishRepository: DishRepository


  fun createFromJson(restaurantData: RestaurantImportJson) {
    val restaurant = restaurantRepository.findByName(restaurantData.name) ?: Restaurant()

    updateRestaurant(restaurant, restaurantData)
    updateDishesFromJson(restaurantData, restaurant)
  }

  private fun updateRestaurant(restaurant: Restaurant, restaurantData: RestaurantImportJson) {
    val updatedRestaurant = restaurant.copy(
        name = restaurantData.name,
        url = restaurantData.url,
        rating = restaurantData.rating,
        telephone = restaurantData.telephone,
        address = restaurantData.street + " " + restaurantData.postalCode + " " + restaurantData.city
    )

    restaurantRepository.save(updatedRestaurant)
  }

  private fun updateDishesFromJson(restaurantData: RestaurantImportJson, restaurant: Restaurant) {
    restaurantData.dishes
        .map { dishJsonData -> getUpdatedDish(dishJsonData, restaurant) }
        .forEach { updatedDish -> dishRepository.save(updatedDish) }
  }

  private fun getUpdatedDish(dishData: DishImportJson, restaurant: Restaurant): Dish {
    val dish = dishRepository.findByName(dishData.name) ?: Dish(restaurant = restaurant, name = dishData.name, category = dishData.category ?: "")

    val (newSideDishJson, existingSideDishJson) = dishData.sidedishes.partition { sideDishJson ->
      findSideDishByName(dish, sideDishJson.name) == null
    }

    val newSideDishes = newSideDishJson.map { sdjson ->
      SideDish(name = sdjson.name, price = priceStringToCents(sdjson.price))
    }

    val updatedSideDishes = existingSideDishJson.map { sideDishJson ->
      findSideDishByName(dish, sideDishJson.name)!!.copy(price = priceStringToCents(sideDishJson.price))
    }

    return dish.copy(price = priceStringToCents(dishData.price), sideDishes = (newSideDishes + updatedSideDishes))
  }

  private fun findSideDishByName(dish: Dish, name: String): SideDish? {
    return dish.sideDishes.find { sd -> sd.name == name }
  }

  private fun priceStringToCents(value: String?): Int {
    return try {
      value?.replace(Regex("[^\\d]"), "")?.toInt() ?: 0
    } catch (e: NumberFormatException) {
      0
    }
  }
}