package altszama.app.restaurant.dto

data class EditRestaurantResponse(
    val id: String,
    val name: String,
    val address: String,
    val telephone: String,
    val url: String
)