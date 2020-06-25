package altszama.app.dish

import altszama.app.dish.dto.CreateDishResponse
import altszama.app.dish.dto.DishCreateRequest
import altszama.app.dish.dto.DishUpdateRequest
import altszama.app.dish.dto.EditDishResponse
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


  @GetMapping("/restaurants/{restaurantId}/dishes/create.json")
  fun createDish(@PathVariable restaurantId: String): CreateDishResponse {
    return dishControllerDataService.getCreateData(restaurantId)
  }

  @PostMapping("/restaurants/{restaurantId}/dishes/save")
  fun saveDish(@PathVariable restaurantId: String, @RequestBody @Valid dishCreateRequest: DishCreateRequest): ResponseEntity<String> {
    dishService.insert(restaurantId, dishCreateRequest)
    return ResponseEntity("{}", HttpStatus.OK)
  }

  @GetMapping("/restaurants/{restaurantId}/dishes/{dishId}/edit.json")
  fun editDish(@PathVariable restaurantId: String, @PathVariable dishId: String): EditDishResponse {
    return dishControllerDataService.getEditData(restaurantId, dishId)
  }

  @PutMapping("/restaurants/{restaurantId}/dishes/update")
  fun updateDish(@PathVariable restaurantId: String, @RequestBody @Valid dishUpdateRequest: DishUpdateRequest): ResponseEntity<String> {
    dishService.update(restaurantId, dishUpdateRequest.id, dishUpdateRequest)
    return ResponseEntity("{}", HttpStatus.OK)
  }

  @DeleteMapping("/restaurants/{restaurantId}/dishes/{dishId}/delete")
  fun deleteDish(@PathVariable dishId: String): ResponseEntity<String> {
    dishService.deleteDish(dishId)
    return ResponseEntity("{}", HttpStatus.OK)
  }

  @DeleteMapping("/dishes/{dishId}/side_dishes/{sideDishId}/delete")
  fun deleteSideDish(@PathVariable dishId: String, @PathVariable sideDishId: String): ResponseEntity<String> {
    dishService.deleteSideDish(dishId, sideDishId)
    return ResponseEntity("{}", HttpStatus.OK)
  }
}