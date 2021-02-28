package altszama.app.order

import altszama.app.auth.UserService
import altszama.app.dish.DishService
import altszama.app.order.dto.*
import altszama.app.orderEntry.OrderEntryRepository
import altszama.app.orderEntry.OrderEntryService
import altszama.app.restaurant.RestaurantRepository
import org.bson.types.ObjectId
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.web.bind.annotation.PathVariable
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

  @Autowired
  private lateinit var userService: UserService


  fun getIndexData(): TodayOrdersResponse {
    val currentUser = userService.currentUser()

    val todaysOrders = orderRepository.findByOrderDate(LocalDate.now())
    val usersOrderEntries = orderEntryRepository.findByUser(currentUser)

    return TodayOrdersResponse.create(todaysOrders, usersOrderEntries)
  }

  fun getAllOrdersData(): AllOrdersResponse {
    val orderList = orderRepository.findAll()

    return AllOrdersResponse.fromOrderList(orderList.asReversed())
  }

  fun getShowData(orderId: String): ShowOrderResponse {
    val currentUserId = userService.currentUser().id

    val order = orderRepository.findById(orderId).get()

    val entries = orderEntryRepository.findByOrderId(orderId)

    val allDishesInRestaurant = dishService.findByRestaurantId(order.restaurant.id)

    val dishIdToSideDishesMap = orderEntryService.getDishToSideDishesMap(order.restaurant)

    return ShowOrderResponse.create(order, entries, currentUserId, allDishesInRestaurant, dishIdToSideDishesMap)
  }

  fun getOrderViewData(orderId: String): OrderViewInitialData {
    orderService.setAsOrdering(orderId)

    val order = orderRepository.findById(orderId).get()
    val entries = orderEntryRepository.findByOrderId(orderId)

    return OrderViewInitialData.create(order, entries)
  }

  fun getCreateData(): CreateOrderInitialData {
    val currentUser = userService.currentUser()

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
