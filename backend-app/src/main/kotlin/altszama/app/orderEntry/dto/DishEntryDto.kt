package altszama.app.orderEntry.dto

import altszama.app.dish.SideDish
import altszama.app.orderEntry.DishEntry
import altszama.app.orderEntry.DishEntryDishData
import org.bson.types.ObjectId

data class DishEntryDto(
  val restaurantName: String,
  val dish: DishEntryDishData,
  val chosenSideDishes: List<SideDish> = emptyList(),
  val additionalComments: String = "",
  val id: String = ObjectId.get().toHexString()
) {

  companion object {
    fun fromDishEntry(dishEntry: DishEntry, restaurantName: String): DishEntryDto {
      return DishEntryDto(
              id = dishEntry.id,
              restaurantName = restaurantName,
              dish = dishEntry.dish,
              chosenSideDishes = dishEntry.chosenSideDishes,
              additionalComments = dishEntry.additionalComments
      )
    }
  }

}