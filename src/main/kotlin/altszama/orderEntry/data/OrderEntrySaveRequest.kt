package altszama.orderEntry.data

import altszama.validation.DishExists
import altszama.validation.OrderExists
import altszama.validation.OrderNotOrderedYet


data class OrderEntrySaveRequest(
    @OrderExists
    @OrderNotOrderedYet
    var orderId: String,

    @DishExists
    var dishId: String,

    var additionalComments: String = "",

    var sideDishesIds: List<String> = emptyList()
)