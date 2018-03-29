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
    val currentUserId: String
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

    fun create(order: Order, entries: List<OrderEntry>, currentUserId: String): ShowResponse {
      val entriesByUser = entries.groupBy { e -> e.user }

      val usersCount = entriesByUser.keys.size

      val participantsUserEntries = entriesByUser
          .flatMap { userToEntries -> userToEntries.value }
          .map { orderEntry ->
            val numberOfDishesForUser = entriesByUser.get(orderEntry.user)!!.size

            val basePrice = orderEntry.dishEntries.sumBy { dishEntry -> dishEntry.priceWithSidedishes() }

            val decreaseAmount = ( basePrice * (order.decreaseInPercent / 100.0) ).toInt()
            val deliveryCostPerOrder = (order.deliveryCostPerEverybody / usersCount) / numberOfDishesForUser
            val deliveryCostPerEntry = order.deliveryCostPerDish

            val finalPrice = basePrice - decreaseAmount + deliveryCostPerOrder + deliveryCostPerEntry

            val dishEntries: List<ParticipantsDishEntry> = orderEntry.dishEntries.map { dishEntry ->
              ParticipantsDishEntry(dishEntry.id, dishEntry.dish, dishEntry.chosenSideDishes, dishEntry.priceWithSidedishes(), dishEntry.additionalComments)
            }

            ParticipantsOrderEntry(
                id = orderEntry.id,
                user = orderEntry.user,
                dishEntries = dishEntries,
                finalPrice = finalPrice,
                paymentStatus = orderEntry.paymentStatus
            )
          }

      return ShowResponse(order, participantsUserEntries, currentUserId)
    }
  }

}