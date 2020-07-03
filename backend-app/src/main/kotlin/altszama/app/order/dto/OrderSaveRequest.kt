package altszama.app.order.dto

import altszama.app.validation.BankTransferNumberPresent
import altszama.app.validation.RestaurantExists
import com.fasterxml.jackson.annotation.JsonFormat
import io.swagger.v3.oas.annotations.media.Schema
import org.jetbrains.annotations.NotNull
import org.springframework.format.annotation.DateTimeFormat
import java.time.LocalDate
import java.time.LocalTime


//@BankTransferNumberPresent(
//    paymentByBankTransfer = "paymentByBankTransfer",
//    bankTransferNumber = "bankTransferNumber")
data class OrderSaveRequest(
    @RestaurantExists
    val restaurantId: String?,
    val teamId: String?,

    @Schema(
            type="string",
            pattern = "[0-9][0-9][0-9][0-9]-[0-1][0-9]-[0-3][0-9]",
            example = "2017-01-31"
    )
    @JsonFormat(pattern = "yyyy-MM-dd")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @NotNull("Order date is empty.")
    val orderDate: LocalDate?,

    @Schema(
            type="string",
            pattern = "[0-9][0-9]:[0-9][0-9]",
            example = "12:00"
    )
    @JsonFormat(pattern = "HH:mm")
    @DateTimeFormat(pattern = "HH:mm")
    val timeOfOrder: LocalTime?,

    val deliveryData: DeliveryData,
    val paymentData: PaymentData
)