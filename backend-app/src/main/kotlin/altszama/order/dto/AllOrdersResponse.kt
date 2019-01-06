package altszama.order.dto

import altszama.order.Order
import altszama.order.OrderState
import org.springframework.format.annotation.DateTimeFormat
import java.time.LocalDate

data class AllOrdersResponse(val allOrdersList: List<OrderDto>) {

  companion object {
    data class OrderDto(
        val id: String,
        val restaurantName: String,
        val orderCreatorUsername: String,
        @DateTimeFormat(pattern = "yyyy-MM-dd")
        val orderDate: LocalDate,
        val orderState: OrderState
    )

    fun fromOrderList(list: List<Order>): AllOrdersResponse {
      return AllOrdersResponse(list.map { order -> fromOrder(order) })
    }

    private fun fromOrder(order: Order): OrderDto {
        return OrderDto(
            order.id,
            order.restaurant.name,
            order.orderCreator.username,
            order.orderDate,
            order.orderState
        )
    }
  }
}