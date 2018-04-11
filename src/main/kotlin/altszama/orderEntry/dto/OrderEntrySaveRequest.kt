package altszama.orderEntry.dto

import altszama.validation.DishExists
import altszama.validation.OrderExists
import altszama.validation.OrderNotOrderedYet


data class OrderEntrySaveRequest(
  @OrderExists
  @OrderNotOrderedYet
  var orderId: String,

  // @DishExists - separate between new dish and existing dish
  var dishId: String,

  var additionalComments: String = "",

  var newDish: Boolean?,

  var newDishName: String?,
  var newDishPrice: Int?,

  var sideDishes: List<SideDishData> = emptyList()
)