package altszama.app.dish

import org.bson.types.ObjectId
import org.springframework.data.annotation.Id
import javax.validation.constraints.NotBlank
import javax.validation.constraints.PositiveOrZero

data class SideDish(
  @Id
  var id: String = ObjectId().toHexString(),

  @field:NotBlank
  var name: String = "",

  @field:PositiveOrZero
  var price: Int = 0
)