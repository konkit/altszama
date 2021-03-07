package altszama.app.restaurant

import altszama.app.auth.UserService
import altszama.app.restaurant.dto.*
import altszama.app.team.TeamService
import altszama.app.validation.AltszamaErrorException
import altszama.app.validation.ErrorResponse
import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.validation.Validator
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

  @Autowired
  private lateinit var objectMapper: ObjectMapper

  @GetMapping("/restaurants.json")
  fun indexRestaurants(): IndexResponse {
    val currentUser = userService.currentUser()
    return restaurantControllerDataService.getIndexData(currentUser)
  }

  @GetMapping("/restaurants/{restaurantId}/show.json")
  fun showRestaurant(@PathVariable restaurantId: String): ShowRestaurantResponse {
    return restaurantControllerDataService.getShowData(restaurantId)
  }

  @PostMapping("/restaurants/save")
  fun saveRestaurant(@RequestBody saveRequest: RestaurantSaveRequest): ResponseEntity<String> = handleErrors {
    val currentUser = userService.currentUser()
    val team = teamService.findByUser(currentUser).get()
    restaurantService.createRestaurant(team, saveRequest)
    ResponseEntity("{}", HttpStatus.CREATED)
  }

  @GetMapping("/restaurants/{restaurantId}/edit.json")
  fun editRestaurant(@PathVariable restaurantId: String): EditRestaurantResponse {
    val currentUser = userService.currentUser()
    return restaurantControllerDataService.getEditRestaurantData(currentUser, restaurantId)
  }

  @PutMapping("/restaurants/update")
  fun updateRestaurant(@RequestBody updateRequest: RestaurantUpdateRequest): ResponseEntity<String> = handleErrors {
    val currentUser = userService.currentUser()
    val currentUserTeam = teamService.findByUser(currentUser).get()
    restaurantService.updateRestaurant(currentUserTeam, updateRequest)
    ResponseEntity("{}", HttpStatus.OK)
  }

  @DeleteMapping("/restaurants/{restaurantId}/delete")
  fun deleteRestaurant(@PathVariable restaurantId: String): ResponseEntity<String> = handleErrors {
      val currentUser = userService.currentUser()
      val currentUserTeam = teamService.findByUser(currentUser).get()
      restaurantService.deleteRestaurant(currentUserTeam, restaurantId)
      ResponseEntity("{}", HttpStatus.OK)
  }

  private fun handleErrors(func: () -> ResponseEntity<String>): ResponseEntity<String> {
    return try {
      func()
    } catch (e: AltszamaErrorException) {
      ResponseEntity(objectMapper.writeValueAsString(ErrorResponse(e.message)), HttpStatus.BAD_REQUEST)
    }
  }
}
