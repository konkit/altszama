package altszama.app.team

import org.bson.types.ObjectId
import org.springframework.data.annotation.Id

data class Team(
        @Id
        var id: String = ObjectId().toHexString(),

        var domains: Set<String> = emptySet(),

        var users: Set<String> = emptySet(),

        var admins: Set<String> = emptySet()
)