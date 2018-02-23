package altszama.order.data

import altszama.order.Order

data class AllOrdersResponse(
    val allOrdersList: List<Order>
)