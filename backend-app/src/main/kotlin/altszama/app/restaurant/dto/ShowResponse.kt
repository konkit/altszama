package altszama.app.restaurant.dto

import altszama.app.dish.Dish
import altszama.app.dish.dto.DishDto
import altszama.app.restaurant.Restaurant

data class ShowResponse(
    var restaurant: Restaurant,
    var dishes: List<DishDto>,
    var dishesByCategory: Map<String, List<DishDto>>
)