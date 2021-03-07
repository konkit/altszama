package altszama.app.restaurant

import altszama.app.auth.UserService
import altszama.app.restaurant.dto.*
import altszama.app.team.TeamService
import altszama.app.validation.AltszamaErrorException
import altszama.app.validation.ErrorResponse
import altszama.app.validation.UserDoesNotBelongToAnyTeam
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

  @GetMapping("/restaurants.json")
  fun indexRestaurants(): IndexResponse {
    val currentUser = userService.currentUser()
    val currentUserTeam = teamService.findByUser(currentUser).orElseThrow { UserDoesNotBelongToAnyTeam() }
    return restaurantControllerDataService.getIndexData(currentUserTeam)
  }

  @GetMapping("/restaurants/{restaurantId}/show.json")
  fun showRestaurant(@PathVariable restaurantId: String): ResponseEntity<ShowRestaurantResponse> {
    val currentUser = userService.currentUser()
    val currentUserTeam = teamService.findByUser(currentUser).orElseThrow { UserDoesNotBelongToAnyTeam() }
    val response = restaurantControllerDataService.getShowData(currentUserTeam, restaurantId)
    return ResponseEntity(response, HttpStatus.OK)
  }

  @PostMapping("/restaurants/save")
  fun saveRestaurant(@RequestBody saveRequest: RestaurantSaveRequest): ResponseEntity<String> {
    val currentUser = userService.currentUser()
    val currentUserTeam = teamService.findByUser(currentUser).orElseThrow { UserDoesNotBelongToAnyTeam() }
    restaurantService.createRestaurant(currentUserTeam, saveRequest)
    return ResponseEntity("{}", HttpStatus.CREATED)
  }

  @GetMapping("/restaurants/{restaurantId}/edit.json")
  fun editRestaurant(@PathVariable restaurantId: String): EditRestaurantResponse {
    val currentUser = userService.currentUser()
    val currentUserTeam = teamService.findByUser(currentUser).orElseThrow { UserDoesNotBelongToAnyTeam() }
    return restaurantControllerDataService.getEditRestaurantData(currentUserTeam, restaurantId)
  }

  @PutMapping("/restaurants/update")
  fun updateRestaurant(@RequestBody updateRequest: RestaurantUpdateRequest): ResponseEntity<String> {
    val currentUser = userService.currentUser()
    val currentUserTeam = teamService.findByUser(currentUser).orElseThrow { UserDoesNotBelongToAnyTeam() }
    restaurantService.updateRestaurant(currentUserTeam, updateRequest)
    return ResponseEntity("{}", HttpStatus.OK)
  }

  @DeleteMapping("/restaurants/{restaurantId}/delete")
  fun deleteRestaurant(@PathVariable restaurantId: String): ResponseEntity<String> {
      val currentUser = userService.currentUser()
      val currentUserTeam = teamService.findByUser(currentUser).get()
      restaurantService.deleteRestaurant(currentUserTeam, restaurantId)
      return ResponseEntity("{}", HttpStatus.OK)
  }
}
