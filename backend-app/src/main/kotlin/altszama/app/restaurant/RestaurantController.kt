package altszama.app.restaurant

import altszama.app.auth.UserService
import altszama.app.restaurant.dto.*
import altszama.app.team.TeamService
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

  @Autowired
  private lateinit var userService: UserService

  @Autowired
  private lateinit var teamService: TeamService

  @GetMapping("/restaurants.json")
  fun indexRestaurants(): IndexResponse {
    val currentUser = userService.currentUser()
    return restaurantControllerDataService.getIndexData(currentUser)
  }

  @GetMapping("/restaurants/{restaurantId}/show.json")
  fun showRestaurant(@PathVariable restaurantId: String): ShowRestaurantResponse {
    return restaurantControllerDataService.getShowData(restaurantId)
  }

  @GetMapping
  fun createRestaurant(): CreateRestaurantInitialData {
    return restaurantControllerDataService.getCreateRestaurantInitialData()
  }

  @PostMapping("/restaurants/save")
  fun saveRestaurant(@Valid @RequestBody saveRequest: RestaurantSaveRequest): ResponseEntity<String> {
    val currentUser = userService.currentUser()
    val team = teamService.findByEmail(currentUser.email).get()
    restaurantService.createRestaurant(team, saveRequest)
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
    return try {
      restaurantService.deleteRestaurant(restaurantId)
      ResponseEntity("{}", HttpStatus.CREATED)
    } catch (e: RestaurantInUseException) {
      ResponseEntity(e.message, HttpStatus.BAD_REQUEST)
    }
  }
}
