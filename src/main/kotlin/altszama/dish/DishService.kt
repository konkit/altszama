package altszama.dish

import altszama.orderEntry.OrderEntryRepository
import org.bson.types.ObjectId
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service


@Service
class DishService {

  @Autowired
  private lateinit var dishRepository: DishRepository

  @Autowired
  private lateinit var orderEntryRepository: OrderEntryRepository


  fun insert(dish: Dish): Dish {
    return dishRepository.insert(dish)
  }

  fun save(dish: Dish): Dish? {
    return dishRepository.save(dish)
  }

  fun findById(dishId: String): Dish? {
    return dishRepository.findOne(dishId)
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

    dishRepository.delete(dishId)
  }

  fun deleteSideDish(dishId: String, sideDishId: String) {
    val dish = dishRepository.findOne(dishId)

    if (dish != null) {
      dish.sideDishes = dish.sideDishes.filter { sd -> sd.id != sideDishId }
      dishRepository.save(dish)
    }
  }

}