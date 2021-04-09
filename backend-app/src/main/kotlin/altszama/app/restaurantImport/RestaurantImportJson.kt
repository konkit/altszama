package altszama.app.restaurantImport

import io.swagger.v3.oas.annotations.media.Schema

data class RestaurantImportJson(
    @Schema(example = "Chinol")
    val name: String,

    @Schema(example = "http://chinol.com")
    val url: String,

    val dishes: List<DishImportJson>,

    @Schema(example = "123 - 456 - 789")
    val telephone: String = "",

    @Schema(example = "ul. Nieprawdziwa 3/4, 30-315 Kraków")
    val address: String = ""
)

data class DishImportJson(
    @Schema(example = "Schabowy")
    val name: String,
    @Schema(example = "12,34")
    val price: String,
    val sidedishes: List<SideDishImportJson>,
    @Schema(example = "Dania dnia")
    val category: String?
)

data class SideDishImportJson(
    @Schema(example = "Dodatkowa suróweczka")
    val name: String,
    @Schema(example = "1,23")
    val price: String?
)