package altszama.dish.dto

import altszama.dish.Dish
import altszama.dish.SideDish
import java.time.Instant

data class EditResponse(
    var dish: DishDto,
    var categories: List<String>
) {
  companion object {

    fun create(dish: Dish, categories: List<String>): EditResponse {
      return EditResponse(DishDto.fromDish(dish), categories)
    }

  }
}