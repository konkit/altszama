package altszama.restaurant

import altszama.dish.DishRepository
import altszama.order.OrderRepository
import altszama.restaurant.dto.RestaurantSaveRequest
import altszama.restaurant.dto.RestaurantUpdateRequest
import org.bson.types.ObjectId
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.time.Instant
import java.util.*

@Service
class RestaurantService {

  @Autowired
  private lateinit var restaurantRepository: RestaurantRepository

  @Autowired
  private lateinit var dishRepository: DishRepository

  @Autowired
  private lateinit var orderRepository: OrderRepository


  fun createRestaurant(saveRequest: RestaurantSaveRequest): Restaurant {
    val newRestaurantObj = Restaurant(
        id = ObjectId().toHexString(),
        name = saveRequest.name,
        telephone = saveRequest.telephone,
        address = saveRequest.address,
        url = saveRequest.url,
        lastCrawled = null,
        lastEdited = Instant.now()
    )
    return restaurantRepository.insert(newRestaurantObj)
  }

  fun updateRestaurant(updateRequest: RestaurantUpdateRequest): Optional<Restaurant> {
    return restaurantRepository.findById(updateRequest.id)
        .map { restaurant ->
          val newRestaurantObj = restaurant.copy(
              name = updateRequest.name,
              telephone = updateRequest.telephone,
              address = updateRequest.address,
              url = updateRequest.url,
              lastEdited = Instant.now()
          )

          restaurantRepository.save(newRestaurantObj)
        }
  }

  fun findById(restaurantId: String): Optional<Restaurant> {
    return restaurantRepository.findById(restaurantId)
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

      restaurantRepository.deleteById(restaurantId)
    }
  }

}
