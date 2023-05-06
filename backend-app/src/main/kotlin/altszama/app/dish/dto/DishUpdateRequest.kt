package altszama.app.dish.dto

import altszama.app.dish.SideDish
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.PositiveOrZero
import jakarta.validation.constraints.Size
import org.bson.types.ObjectId
import org.springframework.data.annotation.Id


data class DishUpdateRequest(
  @Id
  var id: String = ObjectId().toHexString(),

  @field:NotBlank(message = "Dish name cannot be blank")
  @field:Size(min = 1, message = "Dish name cannot be blank")
  var name: String = "",

  @field:PositiveOrZero(message = "Dish price must not be negative")
  var price: Int = 0,

  var sideDishes: List<SideDish> = emptyList(),

  var category: String = ""
)
