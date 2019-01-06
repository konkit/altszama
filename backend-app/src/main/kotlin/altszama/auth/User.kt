package altszama.auth;

import org.bson.types.ObjectId
import org.springframework.data.annotation.Id

class User(username: String, password: String, email: String)
  : org.springframework.security.core.userdetails.User(username, password, emptyList()) {
  @Id
  var id: String = ObjectId.get().toHexString()

  var email: String? = email


  override fun equals(other: Any?): Boolean {
    if (this === other) return true
    if (javaClass != other?.javaClass) return false
    if (!super.equals(other)) return false

    other as User

    if (id != other.id) return false
    if (email != other.email) return false

    return true
  }

  override fun hashCode(): Int {
    var result = super.hashCode()
    result = 31 * result + id.hashCode()
    result = 31 * result + (email?.hashCode() ?: 0)
    return result
  }
}
