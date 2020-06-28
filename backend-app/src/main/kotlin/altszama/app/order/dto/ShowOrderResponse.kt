package altszama.app.order.dto

import altszama.app.auth.User
import altszama.app.dish.Dish
import altszama.app.dish.SideDish
import altszama.app.dish.dto.DishDto
import altszama.app.order.Order
import altszama.app.order.OrderState
import altszama.app.orderEntry.DishEntry
import altszama.app.orderEntry.OrderEntry
import altszama.app.orderEntry.OrderEntryPaymentStatus
import com.fasterxml.jackson.annotation.JsonFormat
import io.swagger.v3.oas.annotations.media.Schema
import org.springframework.format.annotation.DateTimeFormat
import java.time.LocalDate
import java.time.LocalTime

data class ShowOrderResponse(
        val order: ShowOrderDto,
        val orderEntries: List<ParticipantsOrderEntry>,
        val currentUserId: String,
        val allDishesInRestaurant: List<DishDto>,
        val allDishesByCategory: Map<String, List<DishDto>>,
        val dishIdToSideDishesMap: Map<String, List<SideDish>>,
        val baseOrderPrice: Int,
        val totalOrderPrice: Int
) {

  companion object {

    data class ShowOrderDto(
        val id: String,
        val restaurantId: String,
        val restaurantName: String,
        val restaurantUrl: String,
        val orderCreatorId: String,
        val orderCreatorUsername: String,

        @Schema(
                type="string",
                pattern = "[0-9][0-9][0-9][0-9]-[0-1][0-9]-[0-3][0-9]",
                example = "2017-01-31"
        )
        @JsonFormat(pattern = "yyyy-MM-dd")
        @DateTimeFormat(pattern = "yyyy-MM-dd")
        val orderDate: LocalDate,

        @Schema(
                type="string",
                pattern = "[0-9][0-9]:[0-9][0-9]",
                example = "12:00"
        )
        @JsonFormat(pattern = "HH:mm")
        @DateTimeFormat(pattern = "HH:mm")
        val timeOfOrder: LocalTime?,

        val timeOfDelivery: LocalTime?,
        val orderState: OrderState,
        val decreaseInPercent: Int,
        val deliveryCostPerEverybody: Int,
        val deliveryCostPerDish: Int,
        val paymentByCash: Boolean,
        val paymentByBankTransfer: Boolean,
        val bankTransferNumber: String,
        val paymentByBlik: Boolean,
        val blikPhoneNumber: String
    )

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
        val dishId: String,
        val dishName: String,
        val sideDishes: List<SideDish>,
        val price: Int,
        val comments: String
    )

    fun create(order: Order,
               entries: List<OrderEntry>,
               currentUserId: String,
               allDishesInRestaurant: List<Dish>,
               dishIdToSideDishesMap: Map<String, List<SideDish>>): ShowOrderResponse {
      val orderEntriesByUser: Map<User, List<OrderEntry>> = entries.groupBy { e -> e.user }

      val usersCount = orderEntriesByUser.keys.size

      val participantsUserEntries = orderEntriesByUser
          .flatMap { userToEntries -> userToEntries.value }
          .map { orderEntry -> createParticipantOrderEntry(orderEntry, order, usersCount) }

      val allDishesInRestaurantAsDtos = allDishesInRestaurant.map { dish -> DishDto.fromDish(dish) }

      val allDishesInRestaurantByCategory = allDishesInRestaurantAsDtos
          .groupBy { dish -> dish.category }
          .map { x -> x.key to x.value.sortedBy { dish -> dish.name }}
          .toMap()

      val baseOrderPrice = Order.getBasePrice(entries)
      val totalOrderPrice = Order.getTotalPrice(order, entries)

      return ShowOrderResponse(
          fromOrder(order),
          participantsUserEntries,
          currentUserId,
          allDishesInRestaurantAsDtos,
          allDishesInRestaurantByCategory,
          dishIdToSideDishesMap,
          baseOrderPrice,
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
          dishEntry.dish.id,
          dishEntry.dish.name,
          dishEntry.chosenSideDishes,
          dishEntry.dish.price,
          dishEntry.additionalComments
      )
    }

    fun fromOrder(order: Order): ShowOrderDto {
      return ShowOrderDto(
          order.id,
          order.restaurant.id,
          order.restaurant.name,
          order.restaurant.url,
          order.orderCreator.id,
          order.orderCreator.username,
          order.orderDate,
          order.timeOfOrder,
          order.timeOfDelivery,
          order.orderState,
          order.decreaseInPercent,
          order.deliveryCostPerEverybody,
          order.deliveryCostPerDish,
          order.paymentByCash,
          order.paymentByBankTransfer,
          order.bankTransferNumber,
          order.paymentByBlik,
          order.blikPhoneNumber
      )
    }
  }

}