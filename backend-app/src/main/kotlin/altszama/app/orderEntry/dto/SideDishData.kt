package altszama.app.orderEntry.dto

import org.bson.types.ObjectId

data class SideDishData(
    val isNew: Boolean?,
    val newSideDishName: String?,
    val newSideDishPrice: Int?,
    val id: String? = ObjectId.get().toHexString()
)