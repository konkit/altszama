package altszama.orderEntry

import altszama.auth.AuthService
import altszama.dish.DishRepository
import altszama.dish.SideDish
import altszama.order.OrderRepository
import altszama.orderEntry.data.OrderEntrySaveRequest
import altszama.orderEntry.data.OrderEntryUpdateRequest
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

    val dish = dishRepository.findOne(orderEntrySaveRequest.dishId)

    val sideDishes = orderEntrySaveRequest.sideDishesIds.mapNotNull { sideDishId ->
      dish.sideDishes.find { sideDish ->
        sideDish.id == sideDishId
      }
    }

    val newEntry = OrderEntry(
        id = ObjectId().toHexString(),
        order = order,
        user = authService.currentUser(),
        dish = dish,
        additionalComments = orderEntrySaveRequest.additionalComments,
        chosenSideDishes = sideDishes
    )

    orderEntryRepository.save(newEntry)
  }

  fun updateEntry(orderEntryUpdateRequest: OrderEntryUpdateRequest) {
    val orderEntry = orderEntryRepository.findOne(orderEntryUpdateRequest.id)

    val dish = dishRepository.findOne(orderEntryUpdateRequest.dishId)

    val sideDishes = orderEntryUpdateRequest.sideDishesIds.mapNotNull { sideDishId ->
      dish.sideDishes.find { sideDish ->
        sideDish.id == sideDishId
      }
    }

    val updatedEntry = orderEntry.copy(
        dish = dish,
        additionalComments = orderEntryUpdateRequest.additionalComments,
        chosenSideDishes = sideDishes
    )

    orderEntryRepository.save(updatedEntry)
  }

  fun deleteOrderEntry(orderEntryId: String) {
    orderEntryRepository.delete(orderEntryId)
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