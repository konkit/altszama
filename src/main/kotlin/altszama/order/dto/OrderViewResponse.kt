package altszama.order.dto

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
      val basePriceSum = entries.map { e -> e.dishEntries.sumBy { d -> d.priceWithSidedishes() }}.sum()

      val decrease = (order.decreaseInPercent / 100.0 * basePriceSum).toInt()
      val deliveryCostPerDishes = entries.size * order.deliveryCostPerDish

      val orderTotalPrice = basePriceSum - decrease + order.deliveryCostPerEverybody + deliveryCostPerDishes

      val dishToOrderEntryMap: Map<Dish, List<OrderEntry>> = entries
              .flatMap { entry -> entry.dishEntries.map { d -> d.dish to entry} }
              .groupBy { e -> e.first }
              .mapValues { d -> d.value.map { x -> x.second } }

      val groupedUserEntries = dishToOrderEntryMap.map { dishToEntriesMap ->
        val dish = dishToEntriesMap.key
        val entriesForDish: List<OrderEntry> = dishToEntriesMap.value

        fun dishEntriesWithCurrentDish(e: OrderEntry) = e.dishEntries.filter { dishEntry -> dishEntry.dish.id == dish.id }

        val eatingPersonEntries = entriesForDish.flatMap { orderEntry ->
          dishEntriesWithCurrentDish(orderEntry)
              .map { dishEntry -> EatingPersonEntry(orderEntry.user, dishEntry.additionalComments, dishEntry.chosenSideDishes) }
        }

        val priceSumForDish = entriesForDish
            .map { orderEntry ->
              dishEntriesWithCurrentDish(orderEntry).sumBy { entry -> entry.priceWithSidedishes() }
            }.sum()

        GroupedOrderEntry(dish, priceSumForDish, entriesForDish.size, eatingPersonEntries)
      }

      return OrderViewResponse(order, groupedUserEntries, entries.size, basePriceSum, orderTotalPrice)
    }
  }

}

