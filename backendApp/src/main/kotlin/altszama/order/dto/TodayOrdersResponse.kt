package altszama.order.dto

import altszama.order.Order
import altszama.order.OrderState
import altszama.orderEntry.DishEntry
import altszama.orderEntry.OrderEntry
import altszama.orderEntry.OrderEntryPaymentStatus
import org.bson.types.ObjectId
import org.springframework.format.annotation.DateTimeFormat
import java.time.LocalDate
import java.time.LocalTime

data class TodayOrdersResponse(
    val ordersList: List<OrderDto>,
    val createdOrders: List<OrderDto>,
    val orderingOrders: List<OrderDto>,
    val orderedOrders: List<OrderDto>,
    val deliveredOrders: List<OrderDto>,
    val currentOrderEntries: List<OrderEntryDto>
) {

  companion object {

    data class OrderDto(
        val id: String,
        val restaurantId: String,
        val restaurantName: String,
        val orderCreatorId: String,
        val orderCreatorUsername: String,
        @DateTimeFormat(pattern = "yyyy-MM-dd")
        val orderDate: LocalDate,
        val timeOfOrder: LocalTime?,
        var timeOfDelivery: LocalTime?,
        var orderState: OrderState,
        var decreaseInPercent: Int,
        var deliveryCostPerEverybody: Int,
        var deliveryCostPerDish: Int,
        var paymentByCash: Boolean,
        var paymentByBankTransfer: Boolean,
        var bankTransferNumber: String
    )

    data class OrderEntryDto(
        var id: String = ObjectId().toHexString(),
        var orderId: String,
        var orderState: OrderState,

        var dishEntries: List<DishEntry> = emptyList(),

        var paymentStatus: OrderEntryPaymentStatus = OrderEntryPaymentStatus.UNPAID,

        var created: LocalDate = LocalDate.now()
    )

    private fun fromOrder(order: Order): OrderDto {
      return OrderDto(
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
        orderEntry.dishEntries,
        orderEntry.paymentStatus,
        orderEntry.created
      )
    }

    fun create(todaysOrders: List<Order>, usersOrderEntries: List<OrderEntry>): TodayOrdersResponse {
      val todayOrderDtos = todaysOrders.map { order -> fromOrder(order) }

      val orderTypeToOrder = todayOrderDtos
          .groupBy { orderDto -> orderDto.orderState }

      val currentOrderEntries = usersOrderEntries
          .filter { orderEntry -> todaysOrders.any { order -> order.id == orderEntry.order.id } }
          .map { orderEntry -> fromOrderEntry(orderEntry) }

      return TodayOrdersResponse(
          todayOrderDtos,
          orderTypeToOrder[OrderState.CREATED] ?: emptyList(),
          orderTypeToOrder[OrderState.ORDERING] ?: emptyList(),
          orderTypeToOrder[OrderState.ORDERED] ?: emptyList(),
          orderTypeToOrder[OrderState.DELIVERED] ?: emptyList(),
          currentOrderEntries
      )
    }
  }
}