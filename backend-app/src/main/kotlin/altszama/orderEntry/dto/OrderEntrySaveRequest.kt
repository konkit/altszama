package altszama.orderEntry.dto

import altszama.validation.NameNotBlankIfNew
import altszama.validation.OrderExists
import altszama.validation.OrderNotOrderedYet
import javax.validation.Valid
import javax.validation.constraints.PositiveOrZero


@NameNotBlankIfNew(message = "Dish name must not be blank", newDishName = "newDishName", newDish = "newDish")
data class OrderEntrySaveRequest(
  @field:OrderExists
  @field:OrderNotOrderedYet
  var orderId: String,

  // @DishExists - separate between new dish and existing dish
  var dishId: String?,

  var additionalComments: String = "",

  var newDish: Boolean?,

  var newDishName: String?,

  @field:PositiveOrZero(message = "The new dish price must be non-negative")
  var newDishPrice: Int?,

  @field:Valid
  var sideDishes: List<SideDishData> = emptyList()
)