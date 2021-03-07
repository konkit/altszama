package altszama.app.team

import org.apache.commons.lang3.RandomStringUtils
import org.bson.types.ObjectId
import org.springframework.data.annotation.Id

data class Team(
    @Id var id: String = ObjectId().toHexString(),
    var name: String,
    var domain: String,
    var userEmails: List<String>,
    var importUsername: String = defaultRandomValue(),
    val importPassword: String = defaultRandomValue()
) {
  companion object {
    fun defaultRandomValue(): String {
      return RandomStringUtils.randomAlphanumeric(10)
    }
  }
}
