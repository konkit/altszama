package altszama.app.dish

import altszama.app.dish.dto.CreateDishResponse
import altszama.app.dish.dto.DishCreateRequest
import altszama.app.dish.dto.DishUpdateRequest
import altszama.app.dish.dto.EditDishResponse
import altszama.app.utils.CurrentUserService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api")
class DishController {

  @Autowired
  private lateinit var dishControllerDataService: DishControllerDataService

  @Autowired
  private lateinit var dishService: DishService

  @Autowired
  private lateinit var currentUserService: CurrentUserService


  @GetMapping("/restaurants/{restaurantId}/dishes/create.json")
  fun createDish(@PathVariable restaurantId: String): ResponseEntity<CreateDishResponse> {
    val currentUserTeam = currentUserService.getCurrentUserTeam()
    val createData = dishControllerDataService.getCreateData(currentUserTeam, restaurantId)
    return ResponseEntity(createData, HttpStatus.OK)
  }

  @PostMapping("/restaurants/{restaurantId}/dishes/save")
  fun saveDish(@PathVariable restaurantId: String, @RequestBody dishCreateRequest: DishCreateRequest): ResponseEntity<String> {
    val currentUserTeam = currentUserService.getCurrentUserTeam()
    dishService.saveDish(currentUserTeam, restaurantId, dishCreateRequest)
    return ResponseEntity("{}", HttpStatus.CREATED)
  }

  @GetMapping("/restaurants/{restaurantId}/dishes/{dishId}/edit.json")
  fun editDish(@PathVariable restaurantId: String, @PathVariable dishId: String): ResponseEntity<EditDishResponse> {
    val currentUserTeam = currentUserService.getCurrentUserTeam()
    val result = dishControllerDataService.getEditData(currentUserTeam, restaurantId, dishId)
    return ResponseEntity(result, HttpStatus.OK)
  }

  @PutMapping("/restaurants/{restaurantId}/dishes/update")
  fun updateDish(@PathVariable restaurantId: String, @RequestBody dishUpdateRequest: DishUpdateRequest): ResponseEntity<String> {
    val currentUserTeam = currentUserService.getCurrentUserTeam()
    dishService.updateDish(currentUserTeam, restaurantId, dishUpdateRequest.id, dishUpdateRequest)
    return ResponseEntity("{}", HttpStatus.OK)
  }

  @DeleteMapping("/dishes/{dishId}/delete")
  fun deleteDish(@PathVariable dishId: String): ResponseEntity<String> {
    val currentUserTeam = currentUserService.getCurrentUserTeam()
    dishService.deleteDish(currentUserTeam, dishId)
    return ResponseEntity("{}", HttpStatus.OK)
  }

  @DeleteMapping("/dishes/{dishId}/side_dishes/{sideDishId}/delete")
  fun deleteSideDish(@PathVariable dishId: String, @PathVariable sideDishId: String): ResponseEntity<String> {
    val currentUserTeam = currentUserService.getCurrentUserTeam()
    dishService.deleteSideDish(currentUserTeam, dishId, sideDishId)
    return ResponseEntity("{}", HttpStatus.OK)
  }
}
