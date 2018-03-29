package altszama.orderEntry.dto

import altszama.validation.*


data class OrderEntryUpdateRequest(
    @OrderEntryExists
    @IsOrderEntryOwner
    var id: String?,

    var dishEntryId: String?,

    @OrderExists
    @OrderNotOrderedYet
    var orderId: String?,

    @DishExists
    var dishId: String?,

    var additionalComments: String = "",

    var sideDishesIds: List<String> = emptyList()
)