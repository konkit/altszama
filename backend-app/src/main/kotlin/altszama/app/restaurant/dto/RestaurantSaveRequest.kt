package altszama.app.restaurant.dto

import javax.validation.constraints.NotNull
import javax.validation.constraints.Size

data class RestaurantSaveRequest(
    @field:NotNull
    @field:Size(min = 1, message = "Restaurant name cannot be blank!")
    var name: String = "",

    var telephone: String = "",

    var address: String = "",

    var url: String = ""
)