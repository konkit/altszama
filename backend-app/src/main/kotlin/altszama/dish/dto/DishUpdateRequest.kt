package altszama.dish.dto

import altszama.dish.SideDish
import altszama.restaurant.Restaurant
import org.bson.types.ObjectId
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.DBRef
import java.time.Instant
import javax.validation.constraints.NotNull


data class DishUpdateRequest(
  @NotNull
  var restaurant: Restaurant?,

  @Id
  var id: String = ObjectId().toHexString(),

  @NotNull
  var name: String = "",

  @NotNull
  var price: Int = 0,

  var sideDishes: List<SideDish> = emptyList(),

  var category: String = ""
)