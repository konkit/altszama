package altszama.app.restaurant

import altszama.app.restaurant.dto.*
import altszama.app.utils.CurrentUserService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api")
class RestaurantController {

  @Autowired
  private lateinit var restaurantService: RestaurantService

  @Autowired
  private lateinit var restaurantControllerDataService: RestaurantControllerDataService

  @Autowired
  private lateinit var currentUserService: CurrentUserService

  @GetMapping("/restaurants.json")
  fun indexRestaurants(): IndexResponse {
    val currentUserTeam = currentUserService.getCurrentUserTeam()
    return restaurantControllerDataService.getIndexData(currentUserTeam)
  }

  @GetMapping("/restaurants/{restaurantId}/show.json")
  fun showRestaurant(@PathVariable restaurantId: String): ResponseEntity<ShowRestaurantResponse> {
    val currentUserTeam = currentUserService.getCurrentUserTeam()
    val response = restaurantControllerDataService.getShowData(currentUserTeam, restaurantId)
    return ResponseEntity(response, HttpStatus.OK)
  }

  @PostMapping("/restaurants/save")
  fun saveRestaurant(@RequestBody saveRequest: RestaurantSaveRequest): ResponseEntity<String> {
    val currentUserTeam = currentUserService.getCurrentUserTeam()
    restaurantService.createRestaurant(currentUserTeam, saveRequest)
    return ResponseEntity("{}", HttpStatus.CREATED)
  }

  @GetMapping("/restaurants/{restaurantId}/edit.json")
  fun editRestaurant(@PathVariable restaurantId: String): EditRestaurantResponse {
    val currentUserTeam = currentUserService.getCurrentUserTeam()
    return restaurantControllerDataService.getEditRestaurantData(currentUserTeam, restaurantId)
  }

  @PutMapping("/restaurants/update")
  fun updateRestaurant(@RequestBody updateRequest: RestaurantUpdateRequest): ResponseEntity<String> {
    val currentUserTeam = currentUserService.getCurrentUserTeam()
    restaurantService.updateRestaurant(currentUserTeam, updateRequest)
    return ResponseEntity("{}", HttpStatus.OK)
  }

  @DeleteMapping("/restaurants/{restaurantId}/delete")
  fun deleteRestaurant(@PathVariable restaurantId: String): ResponseEntity<String> {
    val currentUserTeam = currentUserService.getCurrentUserTeam()
      restaurantService.deleteRestaurant(currentUserTeam, restaurantId)
      return ResponseEntity("{}", HttpStatus.OK)
  }
}
