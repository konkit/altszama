package altszama.app.order.dto

import altszama.app.dish.SideDish
import altszama.app.order.Order
import altszama.app.order.OrderState
import altszama.app.orderEntry.OrderEntry


data class OrderViewInitialData(
        val orderState: OrderState,
//    val orderDecreaseInPercent: Int,
//    val orderDeliveryCostPerEverybody: Int,
//    val orderDeliveryCostPerDish: Int,
        val orderDeliveryData: DeliveryData,
        val restaurantName: String,
        val restaurantTelephone: String,
        val groupedEntries: List<GroupedOrderEntry>,
        val allEatingPeopleCount: Int,
        val basePriceSum: Int,
        val totalPrice: Int
) {

    companion object {

        data class GroupedOrderEntry(
                val dishName: String,
                val price: Int,
                val eatingPeopleCount: Int,
                val eatingPeopleEntries: List<EatingPersonEntry>
        )

        data class EatingPersonEntry(
                val username: String,
                val comments: String,
                val sideDishes: List<SideDish>
        )

        fun create(order: Order, entries: List<OrderEntry>): OrderViewInitialData {
            val groupedUserEntries = createGroupedUserEntries(entries)
            val basePriceSum = Order.getBasePrice(entries)
            val orderTotalPrice = Order.getTotalPrice(order, entries)

            return OrderViewInitialData(
                    order.orderState,
                    DeliveryData(
                            order.decreaseInPercent,
                            order.deliveryCostPerEverybody,
                            order.deliveryCostPerDish
                    ),
                    order.restaurant.name,
                    order.restaurant.telephone,
                    groupedUserEntries,
                    entries.size,
                    basePriceSum,
                    orderTotalPrice
            )
        }

        private fun createGroupedUserEntries(entries: List<OrderEntry>): List<GroupedOrderEntry> {
          val dishIdToDishNameMap = entries
              .flatMap { entry -> entry.dishEntries }
              .map { d -> d.dish.id to d.dish.name }
              .toMap()

            val dishIdToOrderEntriesMap: Map<String, List<OrderEntry>> = entries
                    .flatMap { entry -> entry.dishEntries.map { d -> d.dish to entry } }
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

                        val dishName = dishIdToDishNameMap[dishId]!!
                        GroupedOrderEntry(dishName, priceSumForDish, mapEntry.value.size, eatingPersonEntries)
                    }
        }
    }

}

