package altszama.app.restaurantImport

data class RestaurantImportJson(
    val name: String,
    val url: String,

    val dishes: List<DishImportJson>,

    val telephone: String = "",

    val address: String = ""
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