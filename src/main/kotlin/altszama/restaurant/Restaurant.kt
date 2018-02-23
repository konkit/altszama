package altszama.restaurant

import org.bson.types.ObjectId
import org.springframework.data.annotation.Id

import javax.validation.constraints.NotNull
import javax.validation.constraints.Size

data class Restaurant(
  @Id
  var id: String = ObjectId().toHexString(),

  @NotNull
  @Size(min = 1, message = "Restaurant name cannot be blank!")
  var name: String = "",

  var rating: Double = 5.0,

  var telephone: String = "",

  var address: String = "",

  var url: String = ""
)
