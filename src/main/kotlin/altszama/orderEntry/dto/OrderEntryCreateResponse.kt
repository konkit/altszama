package altszama.orderEntry.dto

import altszama.dish.Dish
import altszama.dish.SideDish
import altszama.order.Order

data class OrderEntryCreateResponse(
    var order: Order,
    var allDishesInRestaurant: List<Dish>,
    var allDishesByCategory: Map<String, List<Dish>>,
    var dishIdToSideDishesMap: Map<String, List<SideDish>>
)