package altszama.app.dish.dto

import altszama.app.dish.Dish

data class EditDishResponse(
    var dish: DishDto,
    var categories: List<String>
) {
  companion object {

    fun create(dish: Dish, categories: List<String>): EditDishResponse {
      return EditDishResponse(DishDto.fromDish(dish), categories)
    }

  }
}