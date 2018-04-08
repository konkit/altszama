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

  var newDish: Boolean?,

  var newDishName: String?,
  var newDishPrice: Int?,

  var sideDishes: List<SideDishData> = emptyList()
)