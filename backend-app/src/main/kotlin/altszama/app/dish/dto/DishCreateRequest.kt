package altszama.app.dish.dto

import altszama.app.dish.SideDish
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.PositiveOrZero
import jakarta.validation.constraints.Size

data class DishCreateRequest(
  @field:NotNull
  @field:Size(min = 1, message = "Dish name cannot be blank")
  var name: String = "",

  @field:NotNull
  @field:PositiveOrZero(message = "Dish price must not be negative")
  var price: Int = 0,

  var sideDishes: List<SideDish> = emptyList(),

  var category: String = ""
)
