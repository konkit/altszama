package altszama.app.restaurant

import altszama.app.dish.DishService
import altszama.app.dish.dto.DishDto
import altszama.app.restaurant.dto.*
import altszama.app.team.Team
import altszama.app.validation.NoAccessToRestaurant
import altszama.app.validation.RestaurantDoesNotExist
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class RestaurantControllerDataService {

  @Autowired
  private lateinit var restaurantService: RestaurantService

  @Autowired
  private lateinit var dishService: DishService


  fun getIndexData(team: Team): IndexResponse {
    val restaurantToCountMap: Map<Restaurant, Long> = restaurantService.restaurantsToDishCountMap(team)

    val restaurantInfoList = restaurantToCountMap.entries
        .map { entry -> RestaurantInfo(entry.key.id, entry.key.name, entry.key.lastCrawled, entry.key.lastEdited, entry.value) }

    return IndexResponse(restaurantInfoList, ImportCredentials(team.importApiKey))
  }

  fun getShowData(currentUserTeam: Team, restaurantId: String): ShowRestaurantResponse {
    val restaurant = restaurantService.findById(restaurantId).orElseThrow { NoAccessToRestaurant() }

    if (restaurant.team != currentUserTeam) {
      throw NoAccessToRestaurant()
    }

    val dishes = dishService.findAllDishesByRestaurantId(restaurant.id).map { dish -> DishDto.fromDish(dish) }
    val dishesByCategory: Map<String, List<DishDto>> = dishes.groupBy { dish -> dish.category }

    return ShowRestaurantResponse(RestaurantDto.fromRestaurant(restaurant), dishes, dishesByCategory)
  }

  fun getEditRestaurantData(currentUserTeam: Team, restaurantId: String): EditRestaurantResponse {
    val restaurant = restaurantService.findById(restaurantId).orElseThrow { RestaurantDoesNotExist() }

    if (restaurant.team != currentUserTeam) {
      throw NoAccessToRestaurant()
    }

    return EditRestaurantResponse(
        restaurant.id,
        restaurant.name,
        restaurant.address,
        restaurant.telephone,
        restaurant.url
    )
  }
}
