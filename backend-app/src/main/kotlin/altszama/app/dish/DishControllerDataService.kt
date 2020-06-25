package altszama.app.dish

import altszama.app.dish.dto.CreateDishResponse
import altszama.app.dish.dto.EditDishResponse
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class DishControllerDataService {

  @Autowired
  private lateinit var dishService: DishService

  fun getCreateData(restaurantId: String): CreateDishResponse {
    val categories = dishService.allCategories(restaurantId)
    return CreateDishResponse(categories)
  }

  fun getEditData(restaurantId: String, dishId: String): EditDishResponse {
    val dish = dishService.findById(dishId).get()
    val categories = dishService.allCategories(restaurantId)

    return EditDishResponse.create(dish, categories)
  }
}