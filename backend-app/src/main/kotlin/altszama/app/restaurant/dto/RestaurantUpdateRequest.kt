package altszama.app.restaurant.dto

import javax.validation.constraints.NotBlank
import javax.validation.constraints.NotNull
import javax.validation.constraints.Size

data class RestaurantUpdateRequest(
    var id: String,

    @field:NotBlank(message = "Restaurant name cannot be blank")
    var name: String = "",

    var telephone: String = "",

    var address: String = "",

    var url: String = ""
)
