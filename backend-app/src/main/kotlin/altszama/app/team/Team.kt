package altszama.app.team

import org.apache.commons.lang3.RandomStringUtils
import org.bson.types.ObjectId
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.index.Indexed
import org.springframework.data.mongodb.core.mapping.Document

@Document
data class Team(
    @Id var id: String = ObjectId().toHexString(),
    var name: String,

    @Indexed(unique = true)
    var domain: String,

    @Indexed()
    var userEmails: List<String>,

    @Indexed(unique = true)
    var importApiKey: String = defaultRandomValue()
) {
  companion object {
    fun defaultRandomValue(): String {
      return RandomStringUtils.randomAlphanumeric(20)
    }
  }
}
