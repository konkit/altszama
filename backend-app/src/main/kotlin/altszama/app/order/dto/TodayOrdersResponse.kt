package altszama.app.order.dto

import altszama.app.order.Order
import altszama.app.order.OrderState
import altszama.app.orderEntry.OrderEntry
import altszama.app.orderEntry.OrderEntryPaymentStatus
import altszama.app.orderEntry.dto.DishEntryDto
import com.fasterxml.jackson.annotation.JsonFormat
import io.swagger.v3.oas.annotations.media.Schema
import org.bson.types.ObjectId
import org.springframework.format.annotation.DateTimeFormat
import java.time.LocalDate
import java.time.LocalTime

data class TodayOrderDto(
        val id: String,
        val restaurantId: String,
        val restaurantName: String,
        val orderCreatorId: String,
        val orderCreatorUsername: String,

        @Schema(
                type="string",
                pattern = "[0-9][0-9][0-9][0-9]-[0-1][0-9]-[0-3][0-9]",
                example = "2017-01-31"
        )
        @JsonFormat(pattern = "yyyy-MM-dd")
        @DateTimeFormat(pattern = "yyyy-MM-dd")
        val orderDate: LocalDate,

        @Schema(
                type="string",
                pattern = "[0-9][0-9]:[0-9][0-9]",
                example = "12:00"
        )
        @JsonFormat(pattern = "HH:mm")
        @DateTimeFormat(pattern = "HH:mm")
        val timeOfOrder: LocalTime?,
        val timeOfDelivery: LocalTime?,
        val orderState: OrderState,
        val decreaseInPercent: Int,
        val deliveryCostPerEverybody: Int,
        val deliveryCostPerDish: Int,
        val paymentByCash: Boolean,
        val paymentByBankTransfer: Boolean,
        val bankTransferNumber: String
)

data class OrderEntryDto(
        var id: String = ObjectId().toHexString(),
        var orderId: String,
        var orderState: OrderState,

        var dishEntries: List<DishEntryDto> = emptyList(),

        var paymentStatus: OrderEntryPaymentStatus = OrderEntryPaymentStatus.UNPAID,

        var created: LocalDate = LocalDate.now()
)

data class TodayOrdersResponse(
        val ordersList: List<TodayOrderDto>,
        val currentOrderEntries: List<OrderEntryDto>
) {

  companion object {

    private fun fromOrder(order: Order): TodayOrderDto {
      return TodayOrderDto(
        order.id,
        order.restaurant.id,
        order.restaurant.name,
        order.orderCreator.id,
        order.orderCreator.username,
        order.orderDate,
        order.timeOfOrder,
        order.timeOfDelivery,
        order.orderState,
        order.decreaseInPercent,
        order.deliveryCostPerEverybody,
        order.deliveryCostPerDish,
        order.paymentByCash,
        order.paymentByBankTransfer,
        order.bankTransferNumber
      )
    }

    private fun fromOrderEntry(orderEntry: OrderEntry): OrderEntryDto {
      return OrderEntryDto(
        orderEntry.id,
        orderEntry.order.id,
        orderEntry.order.orderState,
        orderEntry.dishEntries.map { dishEntry -> DishEntryDto.fromDishEntry(dishEntry, orderEntry.order.restaurant.name) },
        orderEntry.paymentStatus,
        orderEntry.created
      )
    }

    fun create(todaysOrders: List<Order>, usersOrderEntries: List<OrderEntry>): TodayOrdersResponse {
      val todayOrderDtos = todaysOrders.map { order -> fromOrder(order) }

      val currentOrderEntries = usersOrderEntries
          .filter { orderEntry -> todaysOrders.any { order -> order.id == orderEntry.order.id } }
          .map { orderEntry -> fromOrderEntry(orderEntry) }

      return TodayOrdersResponse(todayOrderDtos, currentOrderEntries)
    }
  }
}