package altszama.app.restaurant

import altszama.app.restaurant.dto.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import javax.validation.Valid

@RestController
@RequestMapping("/api")
class RestaurantController {

  @Autowired
  private lateinit var restaurantService: RestaurantService

  @Autowired
  private lateinit var restaurantControllerDataService: RestaurantControllerDataService


  @GetMapping("/restaurants.json")
  fun indexRestaurants(): IndexResponse {
    return restaurantControllerDataService.getIndexData()
  }

  @GetMapping("/restaurants/{restaurantId}/show.json")
  fun showRestaurant(@PathVariable restaurantId: String): ShowRestaurantResponse {
    return restaurantControllerDataService.getShowData(restaurantId)
  }

  @PostMapping("/restaurants/save")
  fun saveRestaurant(@Valid @RequestBody saveRequest: RestaurantSaveRequest): ResponseEntity<String> {
    restaurantService.createRestaurant(saveRequest)
    return ResponseEntity("{}", HttpStatus.CREATED)
  }

  @GetMapping("/restaurants/{restaurantId}/edit.json")
  fun editRestaurant(@PathVariable restaurantId: String): EditRestaurantResponse {
    return restaurantControllerDataService.getEditRestaurantData(restaurantId)
  }

  @PutMapping("/restaurants/update")
  fun updateRestaurant(@RequestBody @Valid updateRequest: RestaurantUpdateRequest): ResponseEntity<String> {
    restaurantService.updateRestaurant(updateRequest)
    return ResponseEntity("{}", HttpStatus.CREATED)
  }

  @DeleteMapping("/restaurants/{restaurantId}/delete")
  fun deleteRestaurant(@PathVariable restaurantId: String): ResponseEntity<String> {
    restaurantService.deleteRestaurant(restaurantId)
    return ResponseEntity("{}", HttpStatus.CREATED)
  }
}