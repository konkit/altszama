package altszama.app.restaurant.dto

import altszama.app.restaurant.Restaurant
import org.bson.types.ObjectId
import java.time.Instant

data class RestaurantDto(
  var id: String = ObjectId().toHexString(),

  var name: String = "",

  var telephone: String = "",

  var address: String = "",

  var url: String = "",

  var lastCrawled: Instant? = null,

  var lastEdited: Instant? = null
) {
  companion object {
    fun fromRestaurant(restaurant: Restaurant): RestaurantDto = RestaurantDto(
      restaurant.id,
      restaurant.name,
      restaurant.telephone,
      restaurant.address,
      restaurant.url,
      restaurant.lastCrawled,
      restaurant.lastEdited
    )
  }
}