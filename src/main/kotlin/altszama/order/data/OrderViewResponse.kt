package altszama.order.data

import altszama.auth.User
import altszama.dish.Dish
import altszama.dish.SideDish
import altszama.order.Order
import altszama.orderEntry.OrderEntry


data class OrderViewResponse(
    val order: Order,
    val groupedEntries: List<GroupedOrderEntry>,
    val allEatingPeopleCount: Int,
    val basePriceSum: Int,
    val totalPrice: Int
) {

  companion object {

    data class GroupedOrderEntry(
        val dish: Dish,
        val price: Int,
        val eatingPeopleCount: Int,
        val eatingPeopleEntries: List<EatingPersonEntry>
    )

    data class EatingPersonEntry(
        val user: User,
        val comments: String,
        val sideDishes: List<SideDish>
    )

    fun create(order: Order, entries: List<OrderEntry>): OrderViewResponse {
      val basePriceSum = entries.map(OrderEntry::priceWithSidedishes).sum()

      val decrease = (order.decreaseInPercent / 100.0 * basePriceSum).toInt()
      val deliveryCostPerDishes = entries.size * order.deliveryCostPerDish

      val orderTotalPrice = basePriceSum - decrease + order.deliveryCostPerEverybody + deliveryCostPerDishes

      val groupedUserEntries = entries
          .groupBy { entry -> entry.dish }
          .map { (dish, entriesForDish) ->
            val eatingPersonEntries = entriesForDish.map { e ->
              EatingPersonEntry(e.user, e.additionalComments, e.chosenSideDishes)
            }
            val priceSumForDish = entriesForDish.map(OrderEntry::priceWithSidedishes).sum()

            GroupedOrderEntry(dish, priceSumForDish, entriesForDish.size, eatingPersonEntries)
          }

      return OrderViewResponse(order, groupedUserEntries, entries.size, basePriceSum, orderTotalPrice)
    }
  }

}

