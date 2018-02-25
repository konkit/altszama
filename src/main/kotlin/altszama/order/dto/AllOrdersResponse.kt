package altszama.order.dto

import altszama.order.Order

data class AllOrdersResponse(
    val allOrdersList: List<Order>
)