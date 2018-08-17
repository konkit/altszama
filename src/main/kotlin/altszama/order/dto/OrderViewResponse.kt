package altszama.order.dto

import altszama.auth.User
import altszama.dish.Dish
import altszama.dish.SideDish
import altszama.order.Order
import altszama.orderEntry.DishEntry
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
      val groupedUserEntries = createGroupedUserEntries(entries)
      val basePriceSum = getBasePrice(entries)
      val orderTotalPrice = getTotalPrice(basePriceSum, order, entries)

      return OrderViewResponse(order, groupedUserEntries, entries.size, basePriceSum, orderTotalPrice)
    }

    private fun getBasePrice(entries: List<OrderEntry>): Int {
      return entries
          .map { it.dishEntries.sumBy(DishEntry::priceWithSidedishes) }
          .sum()
    }

    private fun getTotalPrice(basePriceSum: Int, order: Order, entries: List<OrderEntry>): Int {
      val decrease = (basePriceSum * order.decreaseInPercent / 100.0).toInt()
      val deliveryCostPerDishes = entries.flatMap { it.dishEntries }.size * order.deliveryCostPerDish
      val priceModifiers = -decrease + order.deliveryCostPerEverybody + deliveryCostPerDishes

      return basePriceSum + priceModifiers
    }

    private fun createGroupedUserEntries(entries: List<OrderEntry>): List<GroupedOrderEntry> {
      val dishesList: List<Dish> = entries
          .flatMap { entry -> entry.dishEntries }
          .map { d -> d.dish }

      val dishIdToOrderEntriesMap: Map<String, List<OrderEntry>> = entries
          .flatMap { entry -> entry.dishEntries.map { d -> d.dish to entry} }
          .groupBy { e -> e.first.id }
          .mapValues { d -> d.value.map { x -> x.second } }

      return dishIdToOrderEntriesMap
          .map { mapEntry ->
              val dishId = mapEntry.key
              val entriesForDish: List<OrderEntry> = mapEntry.value.distinctBy { e -> e.id }

              fun dishEntriesWithCurrentDish(e: OrderEntry) = e.dishEntries.filter { dishEntry -> dishEntry.dish.id == dishId }

              val eatingPersonEntries = entriesForDish.flatMap { orderEntry ->
                dishEntriesWithCurrentDish(orderEntry)
                    .map { dishEntry -> EatingPersonEntry(orderEntry.user, dishEntry.additionalComments, dishEntry.chosenSideDishes) }
              }

              val priceSumForDish = entriesForDish
                  .map { orderEntry ->
                    dishEntriesWithCurrentDish(orderEntry).sumBy { entry -> entry.priceWithSidedishes() }
                  }.sum()

              GroupedOrderEntry(dishesList.find { dish -> dish.id == dishId }!!, priceSumForDish, mapEntry.value.size, eatingPersonEntries)
          }
    }
  }

}

