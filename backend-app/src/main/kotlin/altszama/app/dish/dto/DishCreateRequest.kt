package altszama.app.dish.dto

import altszama.app.dish.SideDish
import javax.validation.constraints.NotNull
import javax.validation.constraints.PositiveOrZero
import javax.validation.constraints.Size

data class DishCreateRequest(
  @field:NotNull
  @field:Size(min = 1, message = "Name cannot be blank!")
  var name: String = "",

  @field:NotNull
  @field:PositiveOrZero(message = "Price must not be negative")
  var price: Int = 0,

  var sideDishes: List<SideDish> = emptyList(),

  var category: String = ""
)