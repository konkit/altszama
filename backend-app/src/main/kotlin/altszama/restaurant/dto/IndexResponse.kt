package altszama.restaurant.dto

import java.time.Instant

data class IndexResponse(
    var restaurants: List<RestaurantInfo>
)

data class RestaurantInfo(val id: String, val name: String, var lastCrawled: Instant?, var lastEdited: Instant?, val dishCount: Long)