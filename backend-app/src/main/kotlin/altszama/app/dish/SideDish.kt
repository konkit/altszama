package altszama.app.dish

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.PositiveOrZero
import org.bson.types.ObjectId
import org.springframework.data.annotation.Id

data class SideDish(
  @Id
  var id: String? = ObjectId().toHexString(),

  @field:NotBlank
  var name: String = "",

  @field:PositiveOrZero
  var price: Int = 0
)
