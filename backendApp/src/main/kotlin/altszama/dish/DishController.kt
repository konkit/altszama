package altszama.dish

import altszama.dish.dto.CreateResponse
import altszama.dish.dto.EditResponse
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import javax.validation.Valid

@RestController
class DishController {

  @Autowired
  private lateinit var dishControllerDataService: DishControllerDataService

  @Autowired
  private lateinit var dishService: DishService


  @RequestMapping("/restaurants/{restaurantId}/dishes/create.json")
  fun create(@PathVariable restaurantId: String): CreateResponse {
    return dishControllerDataService.getCreateData(restaurantId)
  }

  @RequestMapping("/restaurants/{restaurantId}/dishes/save")
  fun save(@PathVariable restaurantId: String, @RequestBody @Valid dish: Dish): ResponseEntity<String> {
    dishService.insert(restaurantId, dish)
    return ResponseEntity("{}", HttpStatus.OK)
  }

  @RequestMapping("/restaurants/{restaurantId}/dishes/{dishId}/edit.json")
  fun edit(@PathVariable restaurantId: String, @PathVariable dishId: String): EditResponse {
    return dishControllerDataService.getEditData(restaurantId, dishId)
  }

  @RequestMapping("/restaurants/{restaurantId}/dishes/update")
  fun update(@PathVariable restaurantId: String, @RequestBody @Valid dish: Dish): ResponseEntity<String> {
    dishService.save(restaurantId, dish)
    return ResponseEntity("{}", HttpStatus.OK)
  }

  @RequestMapping("/restaurants/{restaurantId}/dishes/{dishId}/delete")
  fun delete(@PathVariable dishId: String): ResponseEntity<String> {
    dishService.deleteDish(dishId)
    return ResponseEntity("{}", HttpStatus.OK)
  }

  @RequestMapping("/dishes/{dishId}/side_dishes/{sideDishId}/delete")
  fun deleteSideDish(@PathVariable dishId: String, @PathVariable sideDishId: String): ResponseEntity<String> {
    dishService.deleteSideDish(dishId, sideDishId)
    return ResponseEntity("{}", HttpStatus.OK)
  }
}