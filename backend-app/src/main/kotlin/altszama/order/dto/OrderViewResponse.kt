package altszama.order.dto

import altszama.dish.Dish
import altszama.dish.SideDish
import altszama.dish.dto.DishDto
import altszama.order.Order
import altszama.order.OrderState
import altszama.orderEntry.OrderEntry
import java.time.Instant


data class OrderViewResponse(
    val orderState: OrderState,
    val orderDecreaseInPercent: Int,
    val orderDeliveryCostPerEverybody: Int,
    val orderDeliveryCostPerDish: Int,
    val restaurantName: String,
    val restaurantTelephone: String,
    val groupedEntries: List<GroupedOrderEntry>,
    val allEatingPeopleCount: Int,
    val basePriceSum: Int,
    val totalPrice: Int
) {

  companion object {

    data class GroupedOrderEntry(
        val dish: DishDto,
        val price: Int,
        val eatingPeopleCount: Int,
        val eatingPeopleEntries: List<EatingPersonEntry>
    )

    data class EatingPersonEntry(
        val username: String,
        val comments: String,
        val sideDishes: List<SideDish>
    )

    fun create(order: Order, entries: List<OrderEntry>): OrderViewResponse {
      val groupedUserEntries = createGroupedUserEntries(entries)
      val basePriceSum = Order.getBasePrice(entries)
      val orderTotalPrice = Order.getTotalPrice(order, entries)

      return OrderViewResponse(
          order.orderState,
          order.decreaseInPercent,
          order.deliveryCostPerEverybody,
          order.deliveryCostPerDish,
          order.restaurant.name,
          order.restaurant.telephone,
          groupedUserEntries,
          entries.size,
          basePriceSum,
          orderTotalPrice
      )
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
                    .map { dishEntry -> EatingPersonEntry(orderEntry.user.username, dishEntry.additionalComments, dishEntry.chosenSideDishes) }
              }

              val priceSumForDish = entriesForDish
                  .map { orderEntry ->
                    dishEntriesWithCurrentDish(orderEntry).sumBy { entry -> entry.priceWithSidedishes() }
                  }.sum()

            val dishDto = DishDto.fromDish(dishesList.find { dish -> dish.id == dishId }!!)
            GroupedOrderEntry(dishDto, priceSumForDish, mapEntry.value.size, eatingPersonEntries)
          }
    }
  }

}

