package altszama.order.dto

import altszama.validation.BankTransferNumberPresent
import altszama.validation.IsOrderOwner
import altszama.validation.OrderExists
import altszama.validation.RestaurantExists
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

    @RestaurantExists
    val restaurantId: String?,

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
    val bankTransferNumber: String
)