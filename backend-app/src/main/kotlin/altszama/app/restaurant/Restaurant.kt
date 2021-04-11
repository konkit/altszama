package altszama.app.restaurant

import altszama.app.team.Team
import org.bson.types.ObjectId
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.index.CompoundIndex
import org.springframework.data.mongodb.core.index.CompoundIndexes
import org.springframework.data.mongodb.core.index.Indexed
import org.springframework.data.mongodb.core.mapping.DBRef
import org.springframework.data.mongodb.core.mapping.Document
import java.time.Instant

@Document
@CompoundIndexes(value = [
    CompoundIndex(name = "team_id_to_team", def = "{'team.\$id' : 1}")
])
data class Restaurant(
    @Id
    var id: String = ObjectId().toHexString(),

    @DBRef
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
