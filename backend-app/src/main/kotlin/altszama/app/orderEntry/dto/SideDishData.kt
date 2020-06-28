package altszama.app.orderEntry.dto

import altszama.app.validation.NameNotBlankIfNew
import io.swagger.v3.oas.annotations.media.Schema
import org.bson.types.ObjectId
import javax.validation.constraints.PositiveOrZero

@NameNotBlankIfNew(message = "Side dish name must not be blank", newDishName="newSideDishName", newDish = "isNew")
data class SideDishData(
    val isNew: Boolean?,
    val newSideDishName: String?,

    @field:PositiveOrZero(message = "The new side dish price must be non-negative")
    val newSideDishPrice: Int?,

    val id: String? = ObjectId.get().toHexString()
)