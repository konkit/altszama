package altszama.restaurant.data

import altszama.dish.Dish
import altszama.restaurant.Restaurant

data class ShowResponse(
    var restaurant: Restaurant,
    var dishes: List<Dish>,
    var dishesByCategory: Map<String, List<Dish>>
)