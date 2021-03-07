package altszama.app.restaurant

import altszama.app.auth.User
import altszama.app.dish.DishRepository
import altszama.app.order.OrderRepository
import altszama.app.restaurant.dto.RestaurantSaveRequest
import altszama.app.restaurant.dto.RestaurantUpdateRequest
import altszama.app.team.Team
import altszama.app.team.TeamService
import org.bson.types.ObjectId
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Sort
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

  fun createRestaurant(team: Team, saveRequest: RestaurantSaveRequest): Restaurant {
    val newRestaurantObj = Restaurant(
        id = ObjectId().toHexString(),
        team = team,
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

  fun findByTeamAndName(team1: Team, name: String): Restaurant? {
    return restaurantRepository.findByTeamAndName(team1, name)
  }

  fun deleteRestaurant(restaurantId: String) {
    val ordersFromRestaurant = orderRepository.findByRestaurantId(restaurantId)
    if (ordersFromRestaurant.isNotEmpty()) {
      throw RestaurantInUseException()
    } else {
      val dishesToRemove = dishRepository.findByRestaurantId(restaurantId)
      dishesToRemove.forEach { dish ->
        dishRepository.delete(dish)
      }

      restaurantRepository.deleteById(restaurantId)
    }
  }

  fun restaurantsToDishCountMap(): Map<Restaurant, Long> {
    return restaurantRepository.findAll(Sort.by(Sort.Direction.DESC, "lastCrawled")).map { restaurant ->
      restaurant to dishRepository.countAllByRestaurantId(restaurant.id)
    }.toMap()
  }

}

class RestaurantInUseException() : Exception("There are orders from this restaurant")
