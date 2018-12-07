package altszama.restaurant

import altszama.restaurant.dto.EditResponse
import altszama.restaurant.dto.IndexResponse
import altszama.restaurant.dto.ShowResponse
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
  private lateinit var restaurantControllerService: RestaurantControllerService


  @RequestMapping("/restaurants.json")
  fun index(): IndexResponse {
    return restaurantControllerService.getIndexData()
  }

  @RequestMapping("/restaurants/{restaurantId}/show.json")
  fun show(@PathVariable restaurantId: String): ShowResponse {
    return restaurantControllerService.getShowData(restaurantId)
  }

  @RequestMapping("/restaurants/save")
  fun saveRestaurant(@Valid @RequestBody restaurant: Restaurant): ResponseEntity<String> {
    restaurantService.insert(restaurant)
    return ResponseEntity(HttpStatus.CREATED)
  }

  @RequestMapping("/restaurants/{restaurantId}/edit.json")
  fun editRestaurantJson(@PathVariable restaurantId: String): EditResponse {
    return restaurantControllerService.getEditRestaurantData(restaurantId)
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