package altszama.dish

import altszama.dish.data.CreateDataResponse
import altszama.dish.data.EditDataResponse
import altszama.restaurant.RestaurantService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import javax.validation.Valid


@RestController
class DishController {

  @Autowired
  private lateinit var restaurantService: RestaurantService

  @Autowired
  private lateinit var dishService: DishService


  @RequestMapping("/restaurants/{restaurantId}/dishes/create.json")
  fun createDishJson(@PathVariable restaurantId: String): CreateDataResponse {
    val categories = dishService.allCategories(restaurantId)
    return CreateDataResponse(categories)
  }

  @RequestMapping("/restaurants/{restaurantId}/dishes/save")
  fun saveDish(@PathVariable restaurantId: String, @RequestBody @Valid dish: Dish): ResponseEntity<String> {
    val restaurant = restaurantService.findById(restaurantId)
    dish.restaurant = restaurant

    dishService.insert(dish)

    return ResponseEntity("{}", HttpStatus.OK)
  }

  @RequestMapping("/restaurants/{restaurantId}/dishes/{dishId}/edit.json")
  fun editDishJson(@PathVariable restaurantId: String, @PathVariable dishId: String): EditDataResponse {
    val categories = dishService.allCategories(restaurantId)
    return EditDataResponse(dishService.findById(dishId)!!, categories)
  }

  @RequestMapping("/restaurants/{restaurantId}/dishes/update")
  fun updateDish(@PathVariable restaurantId: String, @RequestBody @Valid dish: Dish): ResponseEntity<String> {
    val restaurant = restaurantService.findById(restaurantId)
    dish.restaurant = restaurant

    dishService.save(dish)

    return ResponseEntity("{}", HttpStatus.OK)
  }

  @RequestMapping("/restaurants/{restaurantId}/dishes/{dishId}/delete")
  fun deleteDish(@PathVariable dishId: String): ResponseEntity<String> {
    dishService.deleteDish(dishId)
    return ResponseEntity("{}", HttpStatus.OK)
  }

  @RequestMapping("/dishes/{dishId}/side_dishes/{sideDishId}/delete")
  fun deleteSideDish(@PathVariable dishId: String, @PathVariable sideDishId: String): ResponseEntity<String> {
    dishService.deleteSideDish(dishId, sideDishId)
    return ResponseEntity("{}", HttpStatus.OK)
  }
}