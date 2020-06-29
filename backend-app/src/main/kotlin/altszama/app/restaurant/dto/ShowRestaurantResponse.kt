package altszama.app.restaurant.dto

import altszama.app.dish.dto.DishDto
import altszama.app.restaurant.Restaurant

data class ShowRestaurantResponse(
    var restaurant: Restaurant,
    var dishes: List<DishDto>,
    var dishesByCategory: Map<String, List<DishDto>>
)