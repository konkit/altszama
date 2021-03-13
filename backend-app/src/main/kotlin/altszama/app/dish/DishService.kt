package altszama.app.dish

import altszama.app.dish.dto.DishCreateRequest
import altszama.app.dish.dto.DishUpdateRequest
import altszama.app.orderEntry.OrderEntryRepository
import altszama.app.restaurant.RestaurantService
import altszama.app.team.Team
import altszama.app.validation.*
import arrow.core.extensions.list.foldable.exists
import org.bson.types.ObjectId
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.time.Instant
import java.util.*
import javax.validation.Validation
import javax.validation.Validator


@Service
class DishService {

  @Autowired
  private lateinit var dishRepository: DishRepository

  @Autowired
  private lateinit var orderEntryRepository: OrderEntryRepository

  @Autowired
  private lateinit var restaurantService: RestaurantService

  fun findDishById(dishId: String): Optional<Dish> {
    return dishRepository.findById(dishId)
  }

  fun findAllDishesByRestaurantId(restaurantId: String): List<Dish> {
    return dishRepository.findByRestaurantId(restaurantId)
  }

  fun getAllCategoriesByRestaurantId(restaurantId: String): List<String> {
    return dishRepository.findByRestaurantId(restaurantId).map { dish -> dish.category }.distinct()
  }

  fun saveDish(currentUserTeam: Team, restaurantId: String, dish: DishCreateRequest): Dish {
    val restaurant = restaurantService.findById(restaurantId).orElseThrow { RestaurantDoesNotExist() }

    if (restaurant.team != currentUserTeam) {
      throw NoAccessToRestaurant()
    }

    val validator: Validator = Validation.buildDefaultValidatorFactory().validator
    val result = validator.validate(dish)

    if (result.isNotEmpty()) {
      throw DishDataInvalid(result.first().message)
    }

    val newDish = Dish(
        restaurant = restaurant,
        id = ObjectId().toHexString(),
        name = dish.name,
        price = dish.price,
        sideDishes = dish.sideDishes,
        category = dish.category,
        lastEdited = Instant.now()
    )

    return dishRepository.insert(newDish)
  }

  fun updateDish(currentUserTeam: Team, restaurantId: String, dishId: String, dishDto: DishUpdateRequest): Dish {
    val restaurant = restaurantService.findById(restaurantId).orElseThrow { RestaurantDoesNotExist() }
    val dish = dishRepository.findById(dishId).orElseThrow { DishDoesNotExist() }

    if (restaurant.team != currentUserTeam) {
      throw NoAccessToRestaurant()
    }

    val validator: Validator = Validation.buildDefaultValidatorFactory().validator
    val result = validator.validate(dishDto)

    if (result.isNotEmpty()) {
      throw DishDataInvalid(result.first().message)
    }

    val updatedDish = dish.copy(
        name = dishDto.name,
        price = dishDto.price,
        sideDishes = dishDto.sideDishes,
        category = dishDto.category,
        lastEdited = Instant.now()
    )

    return dishRepository.save(updatedDish)
  }

  fun deleteDish(currentUserTeam: Team, dishId: String) {
    val dish = dishRepository.findById(dishId).orElseThrow { DishDoesNotExist() }
    val restaurant = restaurantService.findById(dish.restaurant!!.id).orElseThrow { RestaurantDoesNotExist() }

    if (restaurant.team != currentUserTeam) {
      throw NoAccessToRestaurant()
    }

    if (orderEntryRepository.findByDishIdQuery(ObjectId(dishId)).isNotEmpty()) {
      throw DishInUse()
    }

    dishRepository.deleteById(dishId)
  }

  fun deleteSideDish(currentUserTeam: Team, dishId: String, sideDishId: String) {
    val dish = dishRepository.findById(dishId).orElseThrow { DishDoesNotExist() }
    val restaurant = restaurantService.findById(dish.restaurant!!.id).orElseThrow { RestaurantDoesNotExist() }

    if (restaurant.team != currentUserTeam) {
      throw NoAccessToRestaurant()
    }

    val orderEntries = orderEntryRepository.findByDishIdQuery(ObjectId(dishId))
    val sideDishInUse = orderEntries
        .exists { orderEntry ->
          orderEntry.dishEntries.exists { dishEntry ->
            dishEntry.chosenSideDishes.map { sd -> sd.id }.contains(sideDishId)
          }
        }

    if (sideDishInUse) {
      throw SideDishInUse()
    }

    if (dish.sideDishes.exists { sd -> sd.id == sideDishId }) {
      dish.sideDishes = dish.sideDishes.filter { sd -> sd.id != sideDishId }
      dishRepository.save(dish)
    } else {
      throw SideDishDoesNotExist()
    }
  }

}
