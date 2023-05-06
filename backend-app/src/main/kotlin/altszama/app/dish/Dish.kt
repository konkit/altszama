package altszama.app.dish

import altszama.app.restaurant.Restaurant
import jakarta.validation.constraints.NotNull
import org.bson.types.ObjectId
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.index.Indexed
import org.springframework.data.mongodb.core.mapping.DBRef
import org.springframework.data.mongodb.core.mapping.Document
import java.time.Instant

@Document
data class Dish(
  @DBRef
  @NotNull
  @Indexed()
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

  var lastEdited: Instant? = null,

  @Transient
  var orderingIndex: Int? = 0
)
