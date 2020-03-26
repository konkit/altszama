package altszama.app.order.dto

import altszama.app.validation.BankTransferNumberPresent
import altszama.app.validation.IsOrderOwner
import altszama.app.validation.OrderExists
import altszama.app.validation.RestaurantExists
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

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @NotNull("Order date is empty.")
    val orderDate: LocalDate?,

    @DateTimeFormat(iso = DateTimeFormat.ISO.TIME)
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