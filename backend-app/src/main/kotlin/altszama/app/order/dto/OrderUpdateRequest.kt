package altszama.app.order.dto

import altszama.app.validation.BankTransferNumberPresent
import altszama.app.validation.IsOrderOwner
import altszama.app.validation.OrderExists
import altszama.app.validation.RestaurantExists
import com.fasterxml.jackson.annotation.JsonFormat
import io.swagger.v3.oas.annotations.media.Schema
import org.jetbrains.annotations.NotNull
import org.springframework.format.annotation.DateTimeFormat
import java.time.LocalDate
import java.time.LocalTime


@BankTransferNumberPresent(
    paymentByBankTransfer = "paymentByBankTransfer",
    bankTransferNumber = "bankTransferNumber")
data class OrderUpdateRequest(
    @OrderExists
    @IsOrderOwner
    val orderId: String?,

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

    val decreaseInPercent: Int = 0,
    val deliveryCostPerEverybody: Int = 0,
    val deliveryCostPerDish: Int = 0,
    val paymentByCash: Boolean = false,
    val paymentByBankTransfer: Boolean = false,
    val bankTransferNumber: String,
    val paymentByBlik: Boolean = false,
    val blikPhoneNumber: String
)