package altszama.restaurant

import altszama.dish.DishRepository
import altszama.order.OrderRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class RestaurantService {

  @Autowired
  private lateinit var restaurantRepository: RestaurantRepository

  @Autowired
  private lateinit var dishRepository: DishRepository

  @Autowired
  private lateinit var orderRepository: OrderRepository


  fun insert(restaurant: Restaurant): Restaurant {
    return restaurantRepository.insert(restaurant)
  }

  fun save(restaurant: Restaurant): Restaurant {
    return restaurantRepository.save(restaurant)
  }

  fun findById(restaurantId: String): Restaurant? {
    return restaurantRepository.findById(restaurantId)
  }

  fun findOne(restaurantId: String): Restaurant? {
    return restaurantRepository.findOne(restaurantId)
  }

  fun findAll(): List<Restaurant> {
    return restaurantRepository.findAll()
  }

  fun deleteRestaurant(restaurantId: String) {
    val ordersFromRestaurant = orderRepository.findByRestaurantId(restaurantId)
    if (ordersFromRestaurant.isNotEmpty()) {
      throw Exception("There are orders from this restaurant")
    } else {
      val dishesToRemove = dishRepository.findByRestaurantId(restaurantId)
      dishesToRemove.forEach { dish ->
        dishRepository.delete(dish)
      }

      restaurantRepository.delete(restaurantId)
    }
  }

}
