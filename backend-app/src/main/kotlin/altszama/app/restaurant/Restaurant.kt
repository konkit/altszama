package altszama.app.restaurant

import altszama.app.team.Team
import org.bson.types.ObjectId
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.index.Indexed
import org.springframework.data.mongodb.core.mapping.DBRef
import org.springframework.data.mongodb.core.mapping.Document
import java.time.Instant

@Document
data class Restaurant(
    @Id
    var id: String = ObjectId().toHexString(),

    @DBRef
    @Indexed()
    var team: Team,

    @Indexed()
    var name: String = "",

    var telephone: String = "",

    var address: String = "",

    @Indexed()
    var url: String = "",

    var lastCrawled: Instant? = null,

    var lastEdited: Instant? = null
)
