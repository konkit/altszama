package altszama.app.restaurant.dto

import altszama.app.dish.dto.DishDto

data class ShowRestaurantResponse(
    var restaurant: RestaurantDto,
    var dishes: List<DishDto>,
    var dishesByCategory: Map<String, List<DishDto>>
)
