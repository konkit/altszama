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
        val dish: Dish,
        val sideDishes: List<SideDish>,
        val basePrice: Int,
        val finalPrice: Int,
        val comments: String,
        val paymentStatus: OrderEntryPaymentStatus
    )

    fun create(order: Order, entries: List<OrderEntry>, currentUserId: String): ShowResponse {
      val entriesByUser = entries.groupBy { e -> e.user }

      val usersCount = entriesByUser.keys.size

      val participantsUserEntries = entriesByUser
          .flatMap { userToEntries -> userToEntries.value }
          .map { orderEntry ->
            val numberOfDishesForUser = entriesByUser.get(orderEntry.user)!!.size

            val basePrice = orderEntry.priceWithSidedishes()

            val decreaseAmount = ( basePrice * (order.decreaseInPercent / 100.0) ).toInt()
            val deliveryCostPerOrder = (order.deliveryCostPerEverybody / usersCount) / numberOfDishesForUser
            val deliveryCostPerEntry = order.deliveryCostPerDish

            val finalPrice = basePrice - decreaseAmount + deliveryCostPerOrder + deliveryCostPerEntry

            createParticipantEntry(orderEntry, finalPrice)
          }

      return ShowResponse(order, participantsUserEntries, currentUserId)
    }

    private fun createParticipantEntry(orderEntry: OrderEntry, finalPrice: Int): ParticipantsOrderEntry {
      return ParticipantsOrderEntry(
          id = orderEntry.id,
          user = orderEntry.user,
          dish = orderEntry.dish,
          sideDishes = orderEntry.chosenSideDishes,
          basePrice = orderEntry.dish.price,
          finalPrice = finalPrice,
          comments = orderEntry.additionalComments,
          paymentStatus = orderEntry.paymentStatus
      )
    }
  }

}