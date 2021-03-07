package altszama.app.dish

import altszama.app.auth.User
import altszama.app.dish.dto.CreateDishResponse
import altszama.app.dish.dto.EditDishResponse
import altszama.app.restaurant.RestaurantService
import altszama.app.team.Team
import altszama.app.team.TeamService
import altszama.app.validation.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class DishControllerDataService {

  @Autowired
  private lateinit var restaurantService: RestaurantService

  @Autowired
  private lateinit var dishService: DishService

  @Autowired
  private lateinit var teamService: TeamService

  fun getCreateData(currentUserTeam: Team, restaurantId: String): CreateDishResponse {
    val restaurant = restaurantService.findById(restaurantId).orElseThrow { RestaurantDoesNotExist() }

    if (restaurant.team != currentUserTeam) {
      throw NoAccessToRestaurant()
    }

    val categories = dishService.getAllCategoriesByRestaurantId(restaurant.id)

    return CreateDishResponse(categories)
  }

  fun getEditData(currentUserTeam: Team, restaurantId: String, dishId: String): EditDishResponse {
    val restaurant = restaurantService.findById(restaurantId).orElseThrow { RestaurantDoesNotExist() }

    if (restaurant.team != currentUserTeam) {
      throw NoAccessToRestaurant()
    }

    val dish = dishService.findDishById(dishId).orElseThrow { DishDoesNotExist() }
    val categories = dishService.getAllCategoriesByRestaurantId(restaurantId)

    return EditDishResponse.create(dish, categories)
  }
}
