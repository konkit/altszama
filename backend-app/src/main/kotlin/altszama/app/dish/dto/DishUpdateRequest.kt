package altszama.app.dish.dto

import altszama.app.dish.SideDish
import org.bson.types.ObjectId
import org.springframework.data.annotation.Id
import javax.validation.constraints.NotBlank
import javax.validation.constraints.PositiveOrZero
import javax.validation.constraints.Size


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
