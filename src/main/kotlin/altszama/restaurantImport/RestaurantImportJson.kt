package altszama.restaurantImport

data class RestaurantImportJson(
    val name: String,
    val url: String,

    val numberOfVotes: Int,
    val bestRating: Int,
    val rating: Double,

    val telephone: String,

    val latitude: Double,
    val longitude: Double,

    val street: String,
    val city: String,
    val postalCode: String,
    val region: String,

    val dishes: List<DishImportJson>
)

data class DishImportJson(
    val name: String,
    val price: String,
    val sidedishes: List<SideDishImportJson>,
    val category: String?
)

data class SideDishImportJson(
    val name: String,
    val price: String?
)