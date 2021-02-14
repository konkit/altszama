package altszama.app.restaurant

import altszama.app.auth.AuthService
import altszama.app.dish.DishService
import altszama.app.dish.dto.DishDto
import altszama.app.restaurant.dto.*
import altszama.app.team.TeamService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class RestaurantControllerDataService {

  @Autowired
  private lateinit var restaurantService: RestaurantService

  @Autowired
  private lateinit var dishService: DishService

  @Autowired
  private lateinit var authService: AuthService

  @Autowired
  private lateinit var teamService: TeamService

  fun getIndexData(): IndexResponse {
    val restaurantToCountMap: Map<Restaurant, Long> = restaurantService.restaurantsToDishCountMap()

    val restaurantInfoList = restaurantToCountMap.entries
        .map { entry -> RestaurantInfo(entry.key.id, entry.key.name, entry.key.lastCrawled, entry.key.lastEdited, entry.value) }

    return IndexResponse(restaurantInfoList)
  }

  fun getShowData(restaurantId: String): ShowRestaurantResponse {
    val restaurant = restaurantService.findById(restaurantId).get()
    val dishes = dishService.findByRestaurantId(restaurant.id).map { dish -> DishDto.fromDish(dish) }
    val dishesByCategory: Map<String, List<DishDto>> = dishes.groupBy { dish -> dish.category }

    return ShowRestaurantResponse(restaurant, dishes, dishesByCategory)
  }

  fun getCreateRestaurantInitialData(): CreateRestaurantInitialData {
    val currentUser = authService.currentUser()
    val teams = teamService.getForUser(currentUser)

    return CreateRestaurantInitialData(teams)
  }

  fun getEditRestaurantData(restaurantId: String): EditRestaurantResponse {
    val restaurant = restaurantService.findById(restaurantId).get()

    return EditRestaurantResponse(
      restaurant.id,
      restaurant.name,
      restaurant.address,
      restaurant.telephone,
      restaurant.url
    )
  }
}
