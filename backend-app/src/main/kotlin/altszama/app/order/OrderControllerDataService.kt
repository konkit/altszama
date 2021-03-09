package altszama.app.order

import altszama.app.auth.User
import altszama.app.dish.DishService
import altszama.app.order.dto.*
import altszama.app.orderEntry.OrderEntryRepository
import altszama.app.orderEntry.OrderEntryService
import altszama.app.restaurant.RestaurantRepository
import altszama.app.team.Team
import altszama.app.validation.NoAccessToOrder
import altszama.app.validation.OrderDoesNotExist
import altszama.app.validation.YouCannotUpdateThisOrder
import org.bson.types.ObjectId
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.time.LocalDate
import java.util.*

@Service
class OrderControllerDataService {

  @Autowired
  private lateinit var orderService: OrderService

  @Autowired
  private lateinit var orderRepository: OrderRepository

  @Autowired
  private lateinit var orderEntryRepository: OrderEntryRepository

  @Autowired
  private lateinit var orderEntryService: OrderEntryService

  @Autowired
  private lateinit var restaurantRepository: RestaurantRepository

  @Autowired
  private lateinit var dishService: DishService


  fun getIndexData(currentUser: User, currentUserTeam: Team): TodayOrdersResponse {
    val todaysOrders = orderRepository.findByTeamAndOrderDate(currentUserTeam, LocalDate.now())

    val todayOrderDtos = todaysOrders.map { order -> TodayOrderDto.fromOrder(order) }

    val currentOrderEntries = orderEntryRepository.findByUser(currentUser)
        .filter { orderEntry -> todaysOrders.any { order -> order.id == orderEntry.order.id } }
        .map { orderEntry -> OrderEntryDto.fromOrderEntry(orderEntry) }

    return TodayOrdersResponse(todayOrderDtos, currentOrderEntries)
  }

  fun getAllOrdersData(currentUserTeam: Team): AllOrdersResponse {
    val orderList = orderRepository.findAllByTeam(currentUserTeam)

    return AllOrdersResponse.fromOrderList(orderList.asReversed())
  }

  fun getShowData(orderId: String, currentUser: User, currentUserTeam: Team): ShowOrderResponse {
    val order = orderRepository.findById(orderId).orElseThrow { OrderDoesNotExist() }

    if (order.restaurant.team != currentUserTeam) {
      throw NoAccessToOrder()
    }

    val entries = orderEntryRepository.findByOrderId(orderId)

    val allDishesInRestaurant = dishService.findAllDishesByRestaurantId(order.restaurant.id)

    val dishIdToSideDishesMap = orderEntryService.getDishToSideDishesMap(order.restaurant)

    return ShowOrderResponse.create(order, entries, currentUser.id, allDishesInRestaurant, dishIdToSideDishesMap)
  }

  fun getOrderViewData(orderId: String, currentUser: User): OrderViewInitialData {
    orderService.setAsOrdering(orderId, currentUser)

    val order = orderRepository.findById(orderId).get()
    val entries = orderEntryRepository.findByOrderId(orderId)

    return OrderViewInitialData.create(order, entries)
  }

  fun getCreateData(currentUser: User, currentUserTeam: Team): CreateOrderInitialData {
    val ordersByUser: List<Order> = orderRepository.findTop10ByOrderCreatorOrderByOrderDateDesc(currentUser)
    val lastOrderMade: Order? = ordersByUser.sortedByDescending { order -> ObjectId(order.id).timestamp }.firstOrNull()

    val blikPhoneNumber = lastOrderMade?.blikPhoneNumber ?: ""
    val bankTransferNumber = lastOrderMade?.bankTransferNumber ?: ""

    return CreateOrderInitialData(
            restaurantRepository.findAllByTeam(currentUserTeam),
            blikPhoneNumber = blikPhoneNumber,
            bankTransferNumber = bankTransferNumber
    )
  }

  fun getEditData(orderId: String?, currentUser: User): EditOrderInitialData {
    val order = Optional.ofNullable(orderId)
        .flatMap { id -> orderRepository.findById(id) }
        .orElseThrow { OrderDoesNotExist() }

    if (order.orderCreator != currentUser) {
      throw YouCannotUpdateThisOrder()
    }

    return EditOrderInitialData.create(order)
  }
}
