package altszama.app.order.dto

import altszama.app.order.Order
import altszama.app.order.OrderState
import org.springframework.format.annotation.DateTimeFormat
import java.time.LocalDate

data class AllOrdersOrderDto(
        val id: String,
        val restaurantName: String,
        val orderCreatorUsername: String,
        @DateTimeFormat(pattern = "yyyy-MM-dd")
        val orderDate: LocalDate,
        val orderState: OrderState
)

data class AllOrdersResponse(val allOrdersList: List<AllOrdersOrderDto>) {

  companion object {

    fun fromOrderList(list: List<Order>): AllOrdersResponse {
      return AllOrdersResponse(list.map { order -> fromOrder(order) })
    }

    private fun fromOrder(order: Order): AllOrdersOrderDto {
        return AllOrdersOrderDto(
            order.id,
            order.restaurant.name,
            order.orderCreator.username,
            order.orderDate,
            order.orderState
        )
    }
  }
}