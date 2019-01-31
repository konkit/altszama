package altszama.orderEntry.dto

import altszama.dish.SideDish
import altszama.dish.dto.DishDto
import altszama.orderEntry.DishEntry
import org.bson.types.ObjectId

data class DishEntryDto(
    val restaurantName: String,
    val dish: DishDto,
    val chosenSideDishes: List<SideDish> = emptyList(),
    val additionalComments: String = "",
    val id: String = ObjectId.get().toHexString()
) {

  companion object {
    fun fromDishEntry(dishEntry: DishEntry, restaurantName: String): DishEntryDto {
      return DishEntryDto(
              id = dishEntry.id,
              restaurantName = restaurantName,
              dish = DishDto.fromDish(dishEntry.dish),
              chosenSideDishes = dishEntry.chosenSideDishes,
              additionalComments = dishEntry.additionalComments
      )
    }
  }

}