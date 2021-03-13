package altszama.app.restaurant.dto

data class RestaurantSaveRequest(
  var name: String = "",
  var telephone: String = "",
  var address: String = "",
  var url: String = ""
)
