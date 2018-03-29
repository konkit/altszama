package altszama.orderEntry

import altszama.auth.AuthService
import altszama.dish.DishRepository
import altszama.dish.SideDish
import altszama.order.OrderRepository
import altszama.orderEntry.dto.OrderEntrySaveRequest
import altszama.orderEntry.dto.OrderEntryUpdateRequest
import altszama.restaurant.Restaurant
import org.bson.types.ObjectId
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service


@Service
class OrderEntryService {

  @Autowired
  private lateinit var authService: AuthService

  @Autowired
  private lateinit var orderRepository: OrderRepository

  @Autowired
  private lateinit var orderEntryRepository: OrderEntryRepository

  @Autowired
  private lateinit var dishRepository: DishRepository


  fun saveEntry(orderEntrySaveRequest: OrderEntrySaveRequest) {
    val order = orderRepository.findOne(orderEntrySaveRequest.orderId)
    val orderEntry = orderEntryRepository.findByOrderIdAndUser(order.id, authService.currentUser())

    val dish = dishRepository.findOne(orderEntrySaveRequest.dishId)

    val sideDishes = orderEntrySaveRequest.sideDishesIds.mapNotNull { sideDishId ->
      dish.sideDishes.find { sideDish ->
        sideDish.id == sideDishId
      }
    }

    val dishEntries = listOf(DishEntry(dish, sideDishes, orderEntrySaveRequest.additionalComments))

    val savedEntry = if (orderEntry != null) {
      orderEntry.dishEntries = orderEntry.dishEntries + dishEntries
      orderEntry
    } else {
      OrderEntry(
          id = ObjectId().toHexString(),
          order = order,
          user = authService.currentUser(),
          dishEntries = dishEntries
      )
    }

    orderEntryRepository.save(savedEntry)
  }

  fun updateEntry(orderEntryUpdateRequest: OrderEntryUpdateRequest) {
    val orderEntry = orderEntryRepository.findOne(orderEntryUpdateRequest.id)

    val dish = dishRepository.findOne(orderEntryUpdateRequest.dishId)

    val sideDishes = orderEntryUpdateRequest.sideDishesIds.mapNotNull { sideDishId ->
      dish.sideDishes.find { sideDish ->
        sideDish.id == sideDishId
      }
    }

    val updatedDishEntry = DishEntry(dish, sideDishes, orderEntryUpdateRequest.additionalComments, orderEntryUpdateRequest.dishEntryId!!)
    val dishEntries = orderEntry.dishEntries.filter { entry -> entry.id != orderEntryUpdateRequest.dishEntryId!! } + updatedDishEntry

    val updatedEntry = orderEntry.copy(dishEntries = dishEntries)

    orderEntryRepository.save(updatedEntry)
  }

  fun deleteOrderEntry(orderEntryId: String, dishEntryId: String) {
    val orderEntry = orderEntryRepository.findOne(orderEntryId)

    val updatedDishEntries = orderEntry.dishEntries.filter { entry -> entry.id != dishEntryId }

    if (updatedDishEntries.isEmpty()) {
      orderEntryRepository.delete(orderEntryId)
    } else {
      val updatedOrderEntry = orderEntry.copy(dishEntries = updatedDishEntries)
      orderEntryRepository.save(updatedOrderEntry)
    }
  }

  fun getDishToSideDishesMap(restaurant: Restaurant): Map<String, List<SideDish>> {
    val dishesFromRestaurant = dishRepository.findByRestaurantId(restaurant.id)
    return dishesFromRestaurant.map { dish -> dish.id to dish.sideDishes }.toMap()
  }

  fun setAsMarkedAsPaid(orderEntryId: String) {
    val entry = orderEntryRepository.findOne(orderEntryId)

    if (entry.paymentStatus != OrderEntryPaymentStatus.CONFIRMED) {
      entry.paymentStatus = OrderEntryPaymentStatus.MARKED
    }

    orderEntryRepository.save(entry)
  }

  fun setAsConfirmedAsPaid(orderEntryId: String) {
    val entry = orderEntryRepository.findOne(orderEntryId)

    entry.paymentStatus = OrderEntryPaymentStatus.CONFIRMED

    orderEntryRepository.save(entry)
  }
}