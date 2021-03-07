package altszama.app.dish

import altszama.app.auth.UserService
import altszama.app.dish.dto.CreateDishResponse
import altszama.app.dish.dto.DishCreateRequest
import altszama.app.dish.dto.DishUpdateRequest
import altszama.app.dish.dto.EditDishResponse
import altszama.app.team.TeamService
import altszama.app.validation.AltszamaErrorException
import altszama.app.validation.ErrorResponse
import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import javax.validation.Valid

@RestController
@RequestMapping("/api")
class DishController {

  @Autowired
  private lateinit var dishControllerDataService: DishControllerDataService

  @Autowired
  private lateinit var dishService: DishService

  @Autowired
  private lateinit var userService: UserService

  @Autowired
  private lateinit var objectMapper: ObjectMapper

  @Autowired
  private lateinit var teamService: TeamService


  @GetMapping("/restaurants/{restaurantId}/dishes/create.json")
  fun createDish(@PathVariable restaurantId: String): ResponseEntity<String> = handleErrors {
    val currentUser = userService.currentUser()
    val currentUserTeam = teamService.findByUser(currentUser).get()

    val createData = dishControllerDataService.getCreateData(currentUserTeam, restaurantId)
    ResponseEntity(objectMapper.writeValueAsString(createData), HttpStatus.OK)
  }

  @PostMapping("/restaurants/{restaurantId}/dishes/save")
  fun saveDish(@PathVariable restaurantId: String, @RequestBody dishCreateRequest: DishCreateRequest): ResponseEntity<String> = handleErrors {
    val currentUser = userService.currentUser()
    val currentUserTeam = teamService.findByUser(currentUser).get()

    dishService.saveDish(currentUserTeam, restaurantId, dishCreateRequest)
    ResponseEntity("{}", HttpStatus.CREATED)
  }

  @GetMapping("/restaurants/{restaurantId}/dishes/{dishId}/edit.json")
  fun editDish(@PathVariable restaurantId: String, @PathVariable dishId: String): ResponseEntity<String> = handleErrors {
    val currentUser = userService.currentUser()
    val currentUserTeam = teamService.findByUser(currentUser).get()

    val result = dishControllerDataService.getEditData(currentUserTeam, restaurantId, dishId)
    ResponseEntity(objectMapper.writeValueAsString(result), HttpStatus.OK)
  }

  @PutMapping("/restaurants/{restaurantId}/dishes/update")
  fun updateDish(@PathVariable restaurantId: String, @RequestBody dishUpdateRequest: DishUpdateRequest): ResponseEntity<String> = handleErrors {
    val currentUser = userService.currentUser()
    val currentUserTeam = teamService.findByUser(currentUser).get()

    dishService.updateDish(currentUserTeam, restaurantId, dishUpdateRequest.id, dishUpdateRequest)
    ResponseEntity("{}", HttpStatus.OK)
  }

  @DeleteMapping("/dishes/{dishId}/delete")
  fun deleteDish(@PathVariable dishId: String): ResponseEntity<String> = handleErrors {
    val currentUser = userService.currentUser()
    val currentUserTeam = teamService.findByUser(currentUser).get()

    dishService.deleteDish(currentUserTeam, dishId)
    ResponseEntity("{}", HttpStatus.OK)
  }

  @DeleteMapping("/dishes/{dishId}/side_dishes/{sideDishId}/delete")
  fun deleteSideDish(@PathVariable dishId: String, @PathVariable sideDishId: String): ResponseEntity<String> = handleErrors {
    val currentUser = userService.currentUser()
    val currentUserTeam = teamService.findByUser(currentUser).get()

    dishService.deleteSideDish(currentUserTeam, dishId, sideDishId)
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
