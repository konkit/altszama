package altszama.app.order

import altszama.app.auth.User
import altszama.app.dish.DishService
import altszama.app.order.dto.*
import altszama.app.orderEntry.OrderEntryRepository
import altszama.app.orderEntry.OrderEntryService
import altszama.app.restaurant.RestaurantRepository
import org.bson.types.ObjectId
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.time.LocalDate

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

//  @Autowired
//  private lateinit var userService: UserService


  fun getIndexData(currentUser: User): TodayOrdersResponse {
    val todaysOrders = orderRepository.findByOrderDate(LocalDate.now())

    val todayOrderDtos = todaysOrders.map { order -> TodayOrderDto.fromOrder(order) }

    val currentOrderEntries = orderEntryRepository.findByUser(currentUser)
        .filter { orderEntry -> todaysOrders.any { order -> order.id == orderEntry.order.id } }
        .map { orderEntry -> OrderEntryDto.fromOrderEntry(orderEntry) }

    return TodayOrdersResponse(todayOrderDtos, currentOrderEntries)
  }

  fun getAllOrdersData(): AllOrdersResponse {
    val orderList = orderRepository.findAll()

    return AllOrdersResponse.fromOrderList(orderList.asReversed())
  }

  fun getShowData(orderId: String, currentUser: User): ShowOrderResponse {
    val currentUserId = currentUser.id

    val order = orderRepository.findById(orderId).get()

    val entries = orderEntryRepository.findByOrderId(orderId)

    val allDishesInRestaurant = dishService.findByRestaurantId(order.restaurant.id)

    val dishIdToSideDishesMap = orderEntryService.getDishToSideDishesMap(order.restaurant)

    return ShowOrderResponse.create(order, entries, currentUserId, allDishesInRestaurant, dishIdToSideDishesMap)
  }

  fun getOrderViewData(orderId: String, currentUser: User): OrderViewInitialData {
    orderService.setAsOrdering(orderId, currentUser)

    val order = orderRepository.findById(orderId).get()
    val entries = orderEntryRepository.findByOrderId(orderId)

    return OrderViewInitialData.create(order, entries)
  }

  fun getCreateData(currentUser: User): CreateOrderInitialData {
    val ordersByUser: List<Order> = orderRepository.findTop10ByOrderCreatorOrderByOrderDateDesc(currentUser)
    val lastOrderMade: Order? = ordersByUser.sortedByDescending { order -> ObjectId(order.id).timestamp }.firstOrNull()

    val blikPhoneNumber = lastOrderMade?.blikPhoneNumber ?: ""
    val bankTransferNumber = lastOrderMade?.bankTransferNumber ?: ""

    return CreateOrderInitialData(
            restaurantRepository.findAll(),
            blikPhoneNumber = blikPhoneNumber,
            bankTransferNumber = bankTransferNumber
    )
  }

  fun getEditData(orderId: String): EditOrderInitialData {
    return EditOrderInitialData.create(orderRepository.findById(orderId).get())
  }
}
