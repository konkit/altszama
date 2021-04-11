package altszama.app.dish

import altszama.app.restaurant.Restaurant
import org.bson.types.ObjectId
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.index.CompoundIndex
import org.springframework.data.mongodb.core.index.CompoundIndexes
import org.springframework.data.mongodb.core.mapping.DBRef
import org.springframework.data.mongodb.core.mapping.Document
import java.time.Instant
import javax.validation.constraints.NotNull

@Document
@CompoundIndexes(value = [
  CompoundIndex(name = "restaurant_id_to_restaurant", def = "{'restaurant.\$id' : 1}")
])
data class Dish(
  @DBRef
  @NotNull
  var restaurant: Restaurant?,

  @Id
  var id: String = ObjectId().toHexString(),

  @NotNull
  var name: String = "",

  @NotNull
  var price: Int = 0,

  var sideDishes: List<SideDish> = emptyList(),

  var category: String = "",

  var lastCrawled: Instant? = null,

  var lastEdited: Instant? = null
)