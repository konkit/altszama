package altszama.app.restaurant

import altszama.app.dish.DishRepository
import altszama.app.order.OrderRepository
import altszama.app.restaurant.dto.RestaurantSaveRequest
import altszama.app.restaurant.dto.RestaurantUpdateRequest
import altszama.app.team.Team
import altszama.app.validation.NoAccessToRestaurant
import altszama.app.validation.RestaurantDataInvalid
import altszama.app.validation.RestaurantDoesNotExist
import altszama.app.validation.RestaurantInUseException
import jakarta.validation.Validation
import jakarta.validation.Validator
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


  fun findById(restaurantId: String): Optional<Restaurant> {
    return restaurantRepository.findById(restaurantId)
  }

  fun findByTeamAndName(team1: Team, name: String): Restaurant? {
    return restaurantRepository.findByTeamAndName(team1, name)
  }

  fun restaurantsToDishCountMap(team: Team): Map<Restaurant, Long> {
    return restaurantRepository.findAllByTeam(team, Sort.by(Sort.Direction.DESC, "lastCrawled"))
        .map { restaurant ->
          restaurant to dishRepository.countAllByRestaurantId(restaurant.id)
        }
        .toMap()
  }

  fun createRestaurant(team: Team, saveRequest: RestaurantSaveRequest): Restaurant {
    if (saveRequest.name.isBlank()) {
      throw RestaurantDataInvalid("Restaurant name cannot be blank")
    }

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

  fun updateRestaurant(currentUserTeam: Team, updateRequest: RestaurantUpdateRequest): Restaurant {
    val restaurant = restaurantRepository.findById(updateRequest.id).orElseThrow { RestaurantDoesNotExist() }

    if (updateRequest.name.isBlank()) {
      throw RestaurantDataInvalid("Restaurant name cannot be blank")
    }

    if (restaurant.team != currentUserTeam) {
      throw NoAccessToRestaurant()
    }

    val validator: Validator = Validation.buildDefaultValidatorFactory().validator
    val result = validator.validate(updateRequest)

    if (result.isNotEmpty()) {
      throw RestaurantDataInvalid(result.first().message)
    }

    val newRestaurantObj = restaurant.copy(
        name = updateRequest.name,
        telephone = updateRequest.telephone,
        address = updateRequest.address,
        url = updateRequest.url,
        lastEdited = Instant.now()
    )

    return restaurantRepository.save(newRestaurantObj)
  }

  fun deleteRestaurant(currentUserTeam: Team, restaurantId: String) {
    val restaurantToDeleteOpt = restaurantRepository.findById(restaurantId)

    val ordersFromRestaurant = orderRepository.findByRestaurantId(restaurantId)

    if (restaurantToDeleteOpt.isEmpty) {
      throw RestaurantDoesNotExist()
    } else if (restaurantToDeleteOpt.get().team != currentUserTeam) {
      throw NoAccessToRestaurant()
    } else if (ordersFromRestaurant.isNotEmpty()) {
      throw RestaurantInUseException()
    } else {
      val dishesToRemove = dishRepository.findByRestaurantId(restaurantId)
      dishesToRemove.forEach { dish ->
        dishRepository.delete(dish)
      }

      restaurantRepository.deleteById(restaurantId)
    }
  }

}
