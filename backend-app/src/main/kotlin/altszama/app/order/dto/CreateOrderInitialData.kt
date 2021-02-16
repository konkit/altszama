package altszama.app.order.dto

import altszama.app.restaurant.Restaurant
import altszama.app.team.Team
import com.fasterxml.jackson.annotation.JsonFormat
import io.swagger.v3.oas.annotations.media.Schema
import org.springframework.format.annotation.DateTimeFormat
import java.time.LocalDate
import java.time.LocalTime

data class CreateOrderInitialData(
        val restaurantsList: List<Restaurant>,
        val orderDate: LocalDate = LocalDate.now(),

        @Schema(
            type="string",
            pattern = "[0-9][0-9]:[0-9][0-9]",
            example = "12:00"
    )
    @JsonFormat(pattern = "HH:mm")
    @DateTimeFormat(pattern = "HH:mm")
    val timeOfOrder: LocalTime = LocalTime.of(10, 0),

        val bankTransferNumber: String = "",
        val blikPhoneNumber: String = ""
)
