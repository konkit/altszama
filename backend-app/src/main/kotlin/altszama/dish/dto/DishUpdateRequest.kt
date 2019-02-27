package altszama.dish.dto

import altszama.dish.SideDish
import org.bson.types.ObjectId
import org.springframework.data.annotation.Id
import javax.validation.constraints.NotBlank
import javax.validation.constraints.PositiveOrZero
import javax.validation.constraints.Size


data class DishUpdateRequest(
  @Id
  var id: String = ObjectId().toHexString(),

  @field:NotBlank
  @field:Size(min = 1, message = "Name cannot be blank!")
  var name: String = "",

  @field:PositiveOrZero(message = "Price must not be negative")
  var price: Int = 0,

  var sideDishes: List<SideDish> = emptyList(),

  var category: String = ""
)