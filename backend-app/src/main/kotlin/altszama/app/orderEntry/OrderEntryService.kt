package altszama.app.orderEntry

import altszama.app.auth.User
import altszama.app.dish.Dish
import altszama.app.dish.DishRepository
import altszama.app.dish.SideDish
import altszama.app.order.OrderRepository
import altszama.app.order.OrderState
import altszama.app.orderEntry.dto.OrderEntrySaveRequest
import altszama.app.orderEntry.dto.OrderEntryUpdateRequest
import altszama.app.orderEntry.dto.SideDishData
import altszama.app.restaurant.Restaurant
import altszama.app.team.Team
import altszama.app.validation.*
import org.bson.types.ObjectId
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.util.*


@Service
class OrderEntryService {

  @Autowired
  private lateinit var orderRepository: OrderRepository

  @Autowired
  private lateinit var orderEntryRepository: OrderEntryRepository

  @Autowired
  private lateinit var dishRepository: DishRepository


  fun saveEntry(currentUser: User, currentUserTeam: Team, orderEntrySaveRequest: OrderEntrySaveRequest): OrderEntry {
    val order = orderRepository.findById(orderEntrySaveRequest.orderId).orElseThrow { throw OrderDoesNotExist() }

    if (order.restaurant.team != currentUserTeam) {
      throw NoAccessToOrder()
    }

    if (order.orderState == OrderState.REJECTED || (currentUser.id != order.orderCreator.id && order.orderState != OrderState.CREATED)) {
      throw OrderIsLocked()
    }


    val dish: Dish = if (orderEntrySaveRequest.newDish == true) {
      if (orderEntrySaveRequest.newDishName?.isBlank() == true) {
        throw DishNameCannotBeBlank()
      } else if (orderEntrySaveRequest.newDishPrice == null || orderEntrySaveRequest.newDishPrice!! < 0) {
        throw DishPriceCannotBeBlankOrNegative()
      } else {
        createNewDish(order.restaurant, orderEntrySaveRequest.newDishName, orderEntrySaveRequest.newDishPrice)
      }
    } else {
      Optional.ofNullable(orderEntrySaveRequest.dishId)
        .flatMap { dishId -> dishRepository.findById(dishId) }
        .orElseThrow { DishDoesNotExist() }
    }

    val sideDishes: List<SideDish> = orderEntrySaveRequest.sideDishes.mapNotNull { sideDishData ->
      if (sideDishData.isNew == true) {
        if (sideDishData.newSideDishName?.isBlank() == true) {
          throw SideDishNameCannotBeBlank()
        } else if (sideDishData.newSideDishPrice == null || sideDishData.newSideDishPrice < 0) {
          throw SideDishPriceCannotBeBlankOrNegative()
        } else {
          createNewSideDish(sideDishData, dish)
        }
      } else {
        val foundSideDish = dish.sideDishes.find { existingSideDish -> sideDishData.id == existingSideDish.id }
        Optional.ofNullable(foundSideDish).orElseThrow { SideDishDoesNotExist() }
      }
    }

    val dishEntries = listOf(DishEntry(dish, sideDishes, orderEntrySaveRequest.additionalComments))

    val orderEntry = orderEntryRepository.findByOrderIdAndUser(order.id, currentUser)
    val savedEntry = if (orderEntry != null) {
      orderEntry.dishEntries = orderEntry.dishEntries + dishEntries
      orderEntry
    } else {
      OrderEntry(
          id = ObjectId().toHexString(),
          order = order,
          user = currentUser,
          dishEntries = dishEntries
      )
    }

    return orderEntryRepository.save(savedEntry)
  }

  private fun createNewDish(restaurant: Restaurant, dishName: String?, dishPrice: Int?): Dish {
    val dish = Dish(restaurant = restaurant, name = dishName ?: "", price = dishPrice ?: 0)

    dishRepository.save(dish)

    return dish
  }

  private fun createNewSideDish(sideDishEntry: SideDishData, dish: Dish): SideDish {
    val sideDish = SideDish(
        ObjectId().toHexString(),
        sideDishEntry.newSideDishName ?: "",
        sideDishEntry.newSideDishPrice ?: 0
    )

    dish.sideDishes = dish.sideDishes + sideDish
    dishRepository.save(dish)

    return sideDish
  }

  fun updateEntry(currentUser: User, currentUserTeam: Team, orderEntryUpdateRequest: OrderEntryUpdateRequest) {
    val orderEntryId = Optional.ofNullable(orderEntryUpdateRequest.id).orElseThrow { InvalidOrderEntryId() }
    val dishEntryId = Optional.ofNullable(orderEntryUpdateRequest.dishEntryId).orElseThrow { InvalidDishEntryId() }

    val orderEntry = orderEntryRepository.findById(orderEntryId).orElseThrow { throw OrderEntryDoesNotExist() }
    val dishEntry = Optional
      .ofNullable(orderEntry.dishEntries.find { de -> de.id == dishEntryId })
      .orElseThrow { DishEntryDoesNotExist() }

    if (orderEntry.user != currentUser) {
      throw NoAccessToOrderEntry()
    }

    if (orderEntry.order.orderState == OrderState.REJECTED || (currentUser.id != orderEntry.order.orderCreator.id && orderEntry.order.orderState != OrderState.CREATED)) {
      throw OrderIsLocked()
    }

    val dish: Dish = if (orderEntryUpdateRequest.newDish == true) {
      if (orderEntryUpdateRequest.newDishName?.isBlank() == true) {
        throw DishNameCannotBeBlank()
      } else if (orderEntryUpdateRequest.newDishPrice == null || orderEntryUpdateRequest.newDishPrice!! < 0) {
        throw DishPriceCannotBeBlankOrNegative()
      } else {
        createNewDish(orderEntry.order.restaurant, orderEntryUpdateRequest.newDishName, orderEntryUpdateRequest.newDishPrice)
      }
    } else {
      Optional.ofNullable(orderEntryUpdateRequest.dishId)
        .flatMap { dishId -> dishRepository.findById(dishId) }
        .orElseThrow { DishDoesNotExist() }
    }

    val sideDishes: List<SideDish> = orderEntryUpdateRequest.sideDishes.mapNotNull { sideDishData ->
      if (sideDishData.isNew == true) {
        if (sideDishData.newSideDishName?.isBlank() == true) {
          throw SideDishNameCannotBeBlank()
        } else if (sideDishData.newSideDishPrice == null || sideDishData.newSideDishPrice < 0) {
          throw SideDishPriceCannotBeBlankOrNegative()
        } else {
          createNewSideDish(sideDishData, dish)
        }
      } else {
        val foundSideDish = dish.sideDishes.find { existingSideDish -> sideDishData.id == existingSideDish.id }
        Optional.ofNullable(foundSideDish).orElseThrow { SideDishDoesNotExist() }
      }
    }

    val updatedDishEntry = DishEntry(dish, sideDishes, orderEntryUpdateRequest.additionalComments, dishEntryId)
    val dishEntries = orderEntry.dishEntries.map { entry ->
      if (entry.id != dishEntryId) entry else updatedDishEntry
    }

    val updatedEntry = orderEntry.copy(dishEntries = dishEntries)

    orderEntryRepository.save(updatedEntry)
  }

  fun deleteOrderEntry(orderEntryId: String, dishEntryId: String) {
    val orderEntry = orderEntryRepository.findById(orderEntryId).get()

    val updatedDishEntries = orderEntry.dishEntries.filter { entry -> entry.id != dishEntryId }

    if (updatedDishEntries.isEmpty()) {
      orderEntryRepository.deleteById(orderEntryId)
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
    val entry = orderEntryRepository.findById(orderEntryId).get()

    if (entry.paymentStatus != OrderEntryPaymentStatus.CONFIRMED) {
      entry.paymentStatus = OrderEntryPaymentStatus.MARKED
    }

    orderEntryRepository.save(entry)
  }

  fun setAsConfirmedAsPaid(orderEntryId: String) {
    val entry = orderEntryRepository.findById(orderEntryId).get()

    entry.paymentStatus = OrderEntryPaymentStatus.CONFIRMED

    orderEntryRepository.save(entry)
  }

  fun setAsUnpaid(orderEntryId: String) {
    val entry = orderEntryRepository.findById(orderEntryId).get()

    entry.paymentStatus = OrderEntryPaymentStatus.UNPAID

    orderEntryRepository.save(entry)
  }
}
