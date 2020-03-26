package altszama.app.order.dto

import altszama.app.restaurant.Restaurant
import org.springframework.format.annotation.DateTimeFormat
import java.time.LocalDate
import java.time.LocalTime

data class CreateResponse(
    val restaurantsList: List<Restaurant>,
    val orderDate: LocalDate = LocalDate.now(),

    @DateTimeFormat(pattern = "HH:mm")
    val timeOfOrder: LocalTime = LocalTime.of(10, 0),

    val bankTransferNumber: String = "",
    val blikPhoneNumber: String = ""
)