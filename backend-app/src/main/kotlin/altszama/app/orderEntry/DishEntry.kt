package altszama.app.orderEntry

import altszama.app.dish.Dish
import altszama.app.dish.SideDish
import org.bson.types.ObjectId
import javax.validation.constraints.NotNull

data class DishEntry(
    var dish: DishEntryDishData,
    var chosenSideDishes: List<SideDish> = emptyList(),
    var additionalComments: String = "",
    var id: String = ObjectId.get().toHexString()
) {

  fun priceWithSidedishes(): Int {
    return dish.price + chosenSideDishes.map(SideDish::price).sum()
  }

  companion object {
    fun fromDish(dish: Dish): DishEntry {
      return DishEntry(DishEntryDishData.fromDish(dish))
    }
  }

}

data class DishEntryDishData(
  var id: String = ObjectId().toHexString(),

  @NotNull
  var name: String = "",

  @NotNull
  var price: Int = 0
) {
  companion object {
    fun fromDish(dish: Dish) = DishEntryDishData(
      id = dish.id,
      name = dish.name,
      price = dish.price
    )
  }
}