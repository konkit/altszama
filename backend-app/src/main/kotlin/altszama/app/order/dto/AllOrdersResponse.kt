package altszama.app.order.dto

import altszama.app.auth.User
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
        val orderState: OrderState,
        // Added for the Angular frontend; defaulted so existing clients and callers keep working
        val createdByCurrentUser: Boolean = false,
        val currentUserParticipates: Boolean = false
)

data class AllOrdersResponse(val allOrdersList: List<AllOrdersOrderDto>) {

  companion object {

    fun fromOrderList(list: List<Order>, currentUser: User? = null, participatedOrderIds: Set<String> = emptySet()): AllOrdersResponse {
      return AllOrdersResponse(list.map { order -> fromOrder(order, currentUser, participatedOrderIds) })
    }

    private fun fromOrder(order: Order, currentUser: User?, participatedOrderIds: Set<String>): AllOrdersOrderDto {
        return AllOrdersOrderDto(
            order.id,
            order.restaurant.name,
            order.orderCreator.username,
            order.orderDate,
            order.orderState,
            createdByCurrentUser = currentUser != null && order.orderCreator.id == currentUser.id,
            currentUserParticipates = order.id in participatedOrderIds
        )
    }
  }
}