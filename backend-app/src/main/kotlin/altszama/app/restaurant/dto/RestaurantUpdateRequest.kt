package altszama.app.restaurant.dto

data class RestaurantUpdateRequest(
    var id: String,

    var name: String = "",

    var telephone: String = "",

    var address: String = "",

    var url: String = ""
)
