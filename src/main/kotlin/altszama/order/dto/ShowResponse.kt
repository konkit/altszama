package altszama.order.dto

import altszama.auth.User
import altszama.dish.Dish
import altszama.dish.SideDish
import altszama.order.Order
import altszama.orderEntry.OrderEntry
import altszama.orderEntry.OrderEntryPaymentStatus

data class ShowResponse(
    val order: Order,
    val orderEntries: List<ParticipantsOrderEntry>,
    val currentUserId: String,
    var allDishesInRestaurant: List<Dish>,
    var allDishesByCategory: Map<String, List<Dish>>,
    var dishIdToSideDishesMap: Map<String, List<SideDish>>
) {

  companion object {

    data class ParticipantsOrderEntry(
        val id: String,
        val user: User,
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

    fun create(order: Order, entries: List<OrderEntry>, currentUserId: String, allDishesInRestaurant: List<Dish>, allDishesInRestaurantByCategory: Map<String, List<Dish>>, dishIdToSideDishesMap: Map<String, List<SideDish>>): ShowResponse {
      val orderEntriesByUser: Map<User, List<OrderEntry>> = entries.groupBy { e -> e.user }

      val usersCount = orderEntriesByUser.keys.size

      val participantsUserEntries = orderEntriesByUser
          .flatMap { userToEntries -> userToEntries.value }
          .map { orderEntry ->
            val numberOfDishesForUser = orderEntriesByUser.get(orderEntry.user)!!.sumBy { orderEntries -> orderEntries.dishEntries.size }

            val basePrice = orderEntry.dishEntries.sumBy { dishEntry -> dishEntry.priceWithSidedishes() }

            val decreaseAmount = ( basePrice * (order.decreaseInPercent / 100.0) ).toInt()
            val deliveryCostPerOrder = (order.deliveryCostPerEverybody / usersCount) / numberOfDishesForUser
            val deliveryCostPerEntry = order.deliveryCostPerDish

            val finalPrice = basePrice - decreaseAmount + deliveryCostPerOrder + deliveryCostPerEntry

            val dishEntries: List<ParticipantsDishEntry> = orderEntry.dishEntries.map { dishEntry ->
              ParticipantsDishEntry(dishEntry.id, dishEntry.dish, dishEntry.chosenSideDishes, dishEntry.dish.price, dishEntry.additionalComments)
            }

            ParticipantsOrderEntry(
                id = orderEntry.id,
                user = orderEntry.user,
                dishEntries = dishEntries,
                finalPrice = finalPrice,
                paymentStatus = orderEntry.paymentStatus
            )
          }

      return ShowResponse(
          order,
          participantsUserEntries,
          currentUserId,
          allDishesInRestaurant,
          allDishesInRestaurantByCategory,
          dishIdToSideDishesMap
      )
    }
  }

}