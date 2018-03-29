package altszama.orderEntry

import altszama.dish.Dish
import altszama.dish.SideDish
import org.bson.types.ObjectId

data class DishEntry(
    var dish: Dish,
    var chosenSideDishes: List<SideDish> = emptyList(),
    var additionalComments: String = "",
    var id: String = ObjectId.get().toHexString()
) {

  fun priceWithSidedishes(): Int {
    return dish.price + chosenSideDishes.map(SideDish::price).sum()
  }

}