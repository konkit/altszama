package altszama.order.dto

import altszama.order.Order
import altszama.restaurant.Restaurant

data class EditResponse(
    val order: Order,
    val restaurantsList: List<Restaurant>
)