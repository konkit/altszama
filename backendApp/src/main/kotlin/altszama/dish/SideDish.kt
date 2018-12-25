package altszama.dish

import org.bson.types.ObjectId
import org.springframework.data.annotation.Id
import javax.validation.constraints.NotNull

data class SideDish(
  @Id
  var id: String = ObjectId().toHexString(),

  @NotNull
  var name: String = "",

  @NotNull
  var price: Int = 0
)