package altszama.order.dto

import altszama.auth.User
import altszama.dish.Dish
import altszama.dish.SideDish
import altszama.order.Order
import altszama.orderEntry.DishEntry
import altszama.orderEntry.OrderEntry
import altszama.orderEntry.OrderEntryPaymentStatus

data class ShowResponse(
    val order: Order,
    val orderEntries: List<ParticipantsOrderEntry>,
    val currentUserId: String,
    var allDishesInRestaurant: List<Dish>,
    var allDishesByCategory: Map<String, List<Dish>>,
    var dishIdToSideDishesMap: Map<String, List<SideDish>>,
    var totalOrderPrice: Int
) {

  companion object {

    data class ParticipantsOrderEntry(
        val id: String,
        val userId: String,
        val username: String,
        val dishEntries: List<ParticipantsDishEntry>,
        val finalPrice: Int,
        val paymentStatus: OrderEntryPaymentStatus
    )

    data class ParticipantsDishEntry(
        val id: String,
        val dish: Dish,
        val sideDishes: List<SideDish>,
        val price: Int,
        val comments: String
    )

    fun create(order: Order,
               entries: List<OrderEntry>,
               currentUserId: String,
               allDishesInRestaurant: List<Dish>,
               dishIdToSideDishesMap: Map<String, List<SideDish>>): ShowResponse {
      val orderEntriesByUser: Map<User, List<OrderEntry>> = entries.groupBy { e -> e.user }

      val usersCount = orderEntriesByUser.keys.size

      val participantsUserEntries = orderEntriesByUser
          .flatMap { userToEntries -> userToEntries.value }
          .map { orderEntry -> createParticipantOrderEntry(orderEntry, order, usersCount) }

      val allDishesInRestaurantByCategory = allDishesInRestaurant
          .groupBy { dish -> dish.category }
          .map { x -> x.key to x.value.sortedBy { dish -> dish.name }}
          .toMap()

      val totalOrderPrice = Order.getTotalPrice(order, entries)

      return ShowResponse(
          order,
          participantsUserEntries,
          currentUserId,
          allDishesInRestaurant,
          allDishesInRestaurantByCategory,
          dishIdToSideDishesMap,
          totalOrderPrice
      )
    }

    private fun createParticipantOrderEntry(orderEntry: OrderEntry, order: Order, usersCount: Int): ParticipantsOrderEntry {
      val basePrice = orderEntry.dishEntries.sumBy { dishEntry -> dishEntry.priceWithSidedishes() }

      val decreaseAmount = (basePrice * (order.decreaseInPercent / 100.0)).toInt()
      val deliveryCostPerOrder = (order.deliveryCostPerEverybody / usersCount)
      val deliveryCostPerEntry = order.deliveryCostPerDish * orderEntry.dishEntries.size

      val finalPrice = basePrice - decreaseAmount + deliveryCostPerOrder + deliveryCostPerEntry

      val dishEntries: List<ParticipantsDishEntry> = orderEntry.dishEntries
          .map(this::createParticipantsDishEntry)

      return createParticipantsOrderEntry(orderEntry, dishEntries, finalPrice)
    }

    private fun createParticipantsOrderEntry(orderEntry: OrderEntry, dishEntries: List<ParticipantsDishEntry>, finalPrice: Int): ParticipantsOrderEntry {
      return ParticipantsOrderEntry(
          id = orderEntry.id,
          userId = orderEntry.user.id,
          username = orderEntry.user.username,
          dishEntries = dishEntries,
          finalPrice = finalPrice,
          paymentStatus = orderEntry.paymentStatus
      )
    }

    private fun createParticipantsDishEntry(dishEntry: DishEntry): ParticipantsDishEntry {
      return ParticipantsDishEntry(
          dishEntry.id,
          dishEntry.dish,
          dishEntry.chosenSideDishes,
          dishEntry.dish.price,
          dishEntry.additionalComments
      )
    }
  }

}