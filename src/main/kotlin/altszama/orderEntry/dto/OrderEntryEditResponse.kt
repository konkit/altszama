package altszama.orderEntry.dto

import altszama.dish.Dish
import altszama.dish.SideDish
import altszama.order.Order
import altszama.orderEntry.OrderEntry

data class OrderEntryEditResponse(
    var order: Order,
    var allDishesInRestaurant: List<Dish>,
    var allDishesByCategory: Map<String, List<Dish>>,
    var orderEntry: OrderEntry,
    var dishIdToSideDishesMap: Map<String, List<SideDish>>
)