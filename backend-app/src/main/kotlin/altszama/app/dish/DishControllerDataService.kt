package altszama.app.dish

import altszama.app.dish.dto.CreateResponse
import altszama.app.dish.dto.EditResponse
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping

@Service
class DishControllerDataService {

  @Autowired
  private lateinit var dishService: DishService


  @RequestMapping("/restaurants/{restaurantId}/dishes/create.json")
  fun getCreateData(@PathVariable restaurantId: String): CreateResponse {
    val categories = dishService.allCategories(restaurantId)
    return CreateResponse(categories)
  }

  @RequestMapping("/restaurants/{restaurantId}/dishes/{dishId}/edit.json")
  fun getEditData(@PathVariable restaurantId: String, @PathVariable dishId: String): EditResponse {
    val dish = dishService.findById(dishId).get()
    val categories = dishService.allCategories(restaurantId)

    return EditResponse.create(dish, categories)
  }
}