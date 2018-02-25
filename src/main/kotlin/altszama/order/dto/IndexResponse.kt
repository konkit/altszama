package altszama.order.dto

import altszama.order.Order
import altszama.order.OrderState
import altszama.orderEntry.OrderEntry

data class IndexResponse(
    val ordersList: List<Order>,
    val createdOrders: List<Order>,
    val orderingOrders: List<Order>,
    val orderedOrders: List<Order>,
    val deliveredOrders: List<Order>,
    val currentOrderEntries: List<OrderEntry>
) {

  companion object {

    fun create(todaysOrders: List<Order>, usersOrderEntries: List<OrderEntry>): IndexResponse {
      val orderTypeToOrder = todaysOrders.groupBy { order -> order.orderState }

      val currentOrderEntries = usersOrderEntries
          .filter { orderEntry -> todaysOrders.any { order -> order.id == orderEntry.order.id } }

      return IndexResponse(
          todaysOrders,
          orderTypeToOrder[OrderState.CREATED] ?: emptyList(),
          orderTypeToOrder[OrderState.ORDERING] ?: emptyList(),
          orderTypeToOrder[OrderState.ORDERED] ?: emptyList(),
          orderTypeToOrder[OrderState.DELIVERED] ?: emptyList(),
          currentOrderEntries
      )
    }

  }

}