package altszama.restaurant

import altszama.dish.Dish;
import altszama.dish.DishService
import altszama.restaurant.data.EditResponse
import altszama.restaurant.data.IndexResponse
import altszama.restaurant.data.ShowResponse
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import javax.validation.Valid


@RestController
class RestaurantController {

  @Autowired
  private lateinit var restaurantService: RestaurantService

  @Autowired
  private lateinit var dishService: DishService


  @RequestMapping("/restaurants.json")
  fun index(): IndexResponse {
    val restaurants: List<Restaurant> = restaurantService.findAll()
    return IndexResponse(restaurants)
  }

  @RequestMapping("/restaurants/{restaurantId}/show.json")
  fun show(@PathVariable restaurantId: String): ShowResponse {
    val restaurant = restaurantService.findById(restaurantId)!!
    val dishes = dishService.findByRestaurantId(restaurant.id)
    val dishesByCategory: Map<String, List<Dish>> = dishes.groupBy { dish -> dish.category }

    return ShowResponse(restaurant, dishes, dishesByCategory)
  }

  @RequestMapping("/restaurants/save")
  fun saveRestaurant(@Valid @RequestBody restaurant: Restaurant): ResponseEntity<String> {
    restaurantService.insert(restaurant)
    return ResponseEntity(HttpStatus.CREATED)
  }

  @RequestMapping("/restaurants/{restaurantId}/edit.json")
  fun editRestaurantJson(@PathVariable restaurantId: String): EditResponse {
    val restaurant = restaurantService.findById(restaurantId)!!

    return EditResponse(
      restaurant.id,
      restaurant.name,
      restaurant.address,
      restaurant.rating,
      restaurant.telephone,
      restaurant.url
    )
  }

  @RequestMapping("/restaurants/update")
  fun updateRestaurant(@RequestBody @Valid restaurant: Restaurant): ResponseEntity<String> {
    restaurantService.save(restaurant)
    return ResponseEntity("{}", HttpStatus.CREATED)
  }

  @RequestMapping("/restaurants/{restaurantId}/delete")
  fun deleteRestaurant(@PathVariable restaurantId: String): ResponseEntity<String> {
    restaurantService.deleteRestaurant(restaurantId)
    return ResponseEntity(HttpStatus.CREATED)
  }
}