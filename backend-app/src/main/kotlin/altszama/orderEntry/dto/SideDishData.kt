package altszama.orderEntry.dto

import altszama.validation.NameNotBlankIfNew
import org.bson.types.ObjectId
import javax.validation.constraints.PositiveOrZero

@NameNotBlankIfNew(message = "Side dish name must not be blank", newDishName="newSideDishName", newDish = "isNew")
data class SideDishData(
    val isNew: Boolean?,
    val newSideDishName: String?,

    @field:PositiveOrZero(message = "The new side dish price must be non-negative")
    val newSideDishPrice: Int?,
    val id: String = ObjectId.get().toHexString()
)