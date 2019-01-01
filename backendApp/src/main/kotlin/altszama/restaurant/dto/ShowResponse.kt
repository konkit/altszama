package altszama.restaurant.dto

import altszama.dish.Dish
import altszama.dish.dto.DishDto
import altszama.restaurant.Restaurant

data class ShowResponse(
    var restaurant: Restaurant,
    var dishes: List<DishDto>,
    var dishesByCategory: Map<String, List<DishDto>>
)