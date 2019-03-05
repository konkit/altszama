package altszama.restaurantImport

import altszama.dish.Dish
import altszama.dish.DishRepository
import altszama.dish.SideDish
import altszama.restaurant.Restaurant
import altszama.restaurant.RestaurantRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.time.Instant


@Service
class RestaurantImportService {

  @Autowired
  private lateinit var restaurantRepository: RestaurantRepository

  @Autowired
  private lateinit var dishRepository: DishRepository


  fun createFromJson(restaurantData: RestaurantImportJson) {
    val now = Instant.now()

    val restaurant = restaurantRepository.findByName(restaurantData.name)
        ?: restaurantRepository.findByUrl(restaurantData.url) ?: Restaurant()

    val updatedRestaurant = restaurant.copy(
        name = restaurantData.name,
        url = restaurantData.url,
        telephone = restaurantData.telephone,
        address = restaurantData.address,
        lastCrawled = now
    )

    restaurantRepository.save(updatedRestaurant)

    if (restaurantData.dishes.isNotEmpty()) {
      val currentDishes = dishRepository.findByRestaurantId(restaurant.id)

      val dishesToRemove = currentDishes.toMutableList()

      restaurantData.dishes.forEach { dishData ->
        val dishFromExistingList = currentDishes.firstOrNull { dish -> dish.name == dishData.name }

        if (dishFromExistingList != null) {
          dishesToRemove.remove(dishFromExistingList)
        }

        val dish = dishFromExistingList ?: Dish(restaurant = restaurant, name = dishData.name, category = dishData.category ?: "")

        val sideDishes = getUpdatedSideDishes(dishData, dish)

        val updatedDish = dish.copy(
            price = priceStringToCents(dishData.price),
            sideDishes = sideDishes,
            lastCrawled = now
        )

        dishRepository.save(updatedDish)
      }

      dishesToRemove
          .filter { dish -> dish.lastEdited == null }
          .forEach { dish -> dishRepository.delete(dish) }
    }
  }

  private fun getUpdatedSideDishes(dishData: DishImportJson, dish: Dish): List<SideDish> {
    val newSideDishes = dishData.sidedishes
        .filter { sideDishJson -> findSideDishByName(dish, sideDishJson.name) == null }
        .map { sdjson -> SideDish(name = sdjson.name, price = priceStringToCents(sdjson.price)) }

    val updatedSideDishes = dishData.sidedishes
        .filter { sideDishJson -> findSideDishByName(dish, sideDishJson.name) != null }
        .map { sideDishJson -> findSideDishByName(dish, sideDishJson.name)!!.copy(price = priceStringToCents(sideDishJson.price)) }

    return newSideDishes + updatedSideDishes
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