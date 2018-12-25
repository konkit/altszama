package altszama.dish

import altszama.orderEntry.OrderEntryRepository
import altszama.restaurant.RestaurantService
import org.bson.types.ObjectId
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.util.*


@Service
class DishService {

  @Autowired
  private lateinit var dishRepository: DishRepository

  @Autowired
  private lateinit var orderEntryRepository: OrderEntryRepository

  @Autowired
  private lateinit var restaurantService: RestaurantService

  fun insert(restaurantId: String, dish: Dish): Dish {
    val restaurant = restaurantService.findById(restaurantId).get()
    dish.restaurant = restaurant

    return dishRepository.insert(dish)
  }

  fun save(restaurantId: String, dish: Dish): Dish? {
    val restaurant = restaurantService.findById(restaurantId).get()
    dish.restaurant = restaurant

    return dishRepository.save(dish)
  }

  fun findById(dishId: String): Optional<Dish> {
    return dishRepository.findById(dishId)
  }

  fun findByRestaurantId(restaurantId: String): List<Dish> {
    return dishRepository.findByRestaurantId(restaurantId)
  }

  fun allCategories(restaurantId: String): List<String> {
    return dishRepository.findByRestaurantId(restaurantId).map { dish -> dish.category }.distinct()
  }

  fun deleteDish(dishId: String) {
    if (orderEntryRepository.findByDishIdQuery(ObjectId(dishId)).isNotEmpty()) {
      throw Exception("There are order entries using this dish!")
    }

    dishRepository.deleteById(dishId)
  }

  fun deleteSideDish(dishId: String, sideDishId: String) {
    val dishOpt = dishRepository.findById(dishId)

    dishOpt.map { dish ->
      dish.sideDishes = dish.sideDishes.filter { sd -> sd.id != sideDishId }
      dishRepository.save(dish)
    }
  }

}