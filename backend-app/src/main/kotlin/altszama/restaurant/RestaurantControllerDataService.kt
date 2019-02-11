package altszama.restaurant

import altszama.dish.DishService
import altszama.dish.dto.DishDto
import altszama.restaurant.dto.EditResponse
import altszama.restaurant.dto.IndexResponse
import altszama.restaurant.dto.RestaurantInfo
import altszama.restaurant.dto.ShowResponse
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class RestaurantControllerDataService {

  @Autowired
  private lateinit var restaurantService: RestaurantService

  @Autowired
  private lateinit var dishService: DishService

  fun getIndexData(): IndexResponse {
    val restaurantToCountMap: Map<Restaurant, Long> = restaurantService.restaurantsToDishCountMap()

    val restaurantInfoList = restaurantToCountMap.entries.map { entry -> RestaurantInfo(entry.key.id, entry.key.name, entry.key.lastCrawled, entry.key.lastEdited, entry.value) }

    return IndexResponse(restaurantInfoList)
  }

  fun getShowData(restaurantId: String): ShowResponse {
    val restaurant = restaurantService.findById(restaurantId).get()
    val dishes = dishService.findByRestaurantId(restaurant.id).map { dish -> DishDto.fromDish(dish) }
    val dishesByCategory: Map<String, List<DishDto>> = dishes.groupBy { dish -> dish.category }

    return ShowResponse(restaurant, dishes, dishesByCategory)
  }

  fun getEditRestaurantData(restaurantId: String): EditResponse {
    val restaurant = restaurantService.findById(restaurantId).get()

    return EditResponse(
      restaurant.id,
      restaurant.name,
      restaurant.address,
      restaurant.telephone,
      restaurant.url
    )
  }
}