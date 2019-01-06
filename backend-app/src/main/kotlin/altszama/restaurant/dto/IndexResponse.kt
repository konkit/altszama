package altszama.restaurant.dto

import altszama.restaurant.Restaurant

data class IndexResponse(
    var restaurants: List<Restaurant>
)