package altszama.app.team

import org.bson.types.ObjectId
import org.springframework.data.annotation.Id

data class Team(
        @Id
        var id: String = ObjectId().toHexString(),

        var name: String,

        var domain: String?
)