package altszama.app.auth;

import org.bson.types.ObjectId
import org.springframework.data.annotation.Id

data class User(val username: String,
                val password: String,
                val email: String,
                @Id var id: String = ObjectId.get().toHexString()) {

}
