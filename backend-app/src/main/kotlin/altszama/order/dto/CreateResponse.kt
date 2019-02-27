package altszama.order.dto

import altszama.restaurant.Restaurant
import org.springframework.format.annotation.DateTimeFormat
import java.time.LocalDate
import java.time.LocalTime

data class CreateResponse(
    val restaurantsList: List<Restaurant>,
    val orderDate: LocalDate = LocalDate.now(),

    @DateTimeFormat(pattern = "HH:mm")
    val timeOfOrder: LocalTime = LocalTime.of(10, 0)
)