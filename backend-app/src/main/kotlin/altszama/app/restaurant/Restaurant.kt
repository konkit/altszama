package altszama.app.restaurant

import altszama.app.team.Team
import org.bson.types.ObjectId
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.DBRef
import java.time.Instant
import javax.validation.constraints.NotNull
import javax.validation.constraints.Size

data class Restaurant(
    @Id
    var id: String = ObjectId().toHexString(),

    @DBRef
    var team: Team,

    @field:NotNull
    @field:Size(min = 1, message = "Restaurant name cannot be blank!")
    var name: String = "",

    var telephone: String = "",

    var address: String = "",

    var url: String = "",

    var lastCrawled: Instant? = null,

    var lastEdited: Instant? = null
)
