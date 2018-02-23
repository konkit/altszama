package altszama.restaurant.data

data class EditResponse(
    val id: String,
    val name: String,
    val address: String,
    val rating: Double,
    val telephone: String,
    val url: String
)