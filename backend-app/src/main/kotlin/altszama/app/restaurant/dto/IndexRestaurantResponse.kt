package altszama.app.restaurant.dto

import java.time.Instant

data class IndexResponse(
    var restaurants: List<RestaurantInfo>,
    var importCredentials: ImportCredentials
)

data class RestaurantInfo(
    val id: String,
    val name: String,
    var lastCrawled: Instant?,
    var lastEdited: Instant?,
    val dishCount: Long
)

data class ImportCredentials(val username: String, val password: String)
