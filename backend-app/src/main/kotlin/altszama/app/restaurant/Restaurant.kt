package altszama.app.restaurant

import altszama.app.team.Team
import org.bson.types.ObjectId
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.DBRef
import java.time.Instant

data class Restaurant(
    @Id
    var id: String = ObjectId().toHexString(),

    @DBRef
    var team: Team,

    var name: String = "",

    var telephone: String = "",

    var address: String = "",

    var url: String = "",

    var lastCrawled: Instant? = null,

    var lastEdited: Instant? = null
)
