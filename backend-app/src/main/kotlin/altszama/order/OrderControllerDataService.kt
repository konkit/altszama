package altszama.order

import altszama.auth.AuthService
import altszama.dish.DishService
import altszama.order.dto.*
import altszama.orderEntry.OrderEntryRepository
import altszama.orderEntry.OrderEntryService
import altszama.restaurant.RestaurantRepository
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
  private lateinit var authService: AuthService


  fun getIndexData(): TodayOrdersResponse {
    val currentUser = authService.currentUser()

    val todaysOrders = orderRepository.findByOrderDate(LocalDate.now())
    val usersOrderEntries = orderEntryRepository.findByUser(currentUser)

    return TodayOrdersResponse.create(todaysOrders, usersOrderEntries)
  }

  fun getAllOrdersData(): AllOrdersResponse {
    return AllOrdersResponse.fromOrderList(orderRepository.findAll().asReversed())
  }

  fun getShowData(orderId: String): ShowResponse {
    val currentUserId = authService.currentUser().id

    val order = orderRepository.findById(orderId).get()
    val entries = orderEntryRepository.findByOrderId(orderId)

    val allDishesInRestaurant = dishService.findByRestaurantId(order.restaurant.id)

    val dishIdToSideDishesMap = orderEntryService.getDishToSideDishesMap(order.restaurant)

    return ShowResponse.create(order, entries, currentUserId, allDishesInRestaurant, dishIdToSideDishesMap)
  }

  fun getOrderViewData(orderId: String): OrderViewResponse {
    orderService.setAsOrdering(orderId)

    val order = orderRepository.findById(orderId).get()
    val entries = orderEntryRepository.findByOrderId(orderId)

    return OrderViewResponse.create(order, entries)
  }

  fun getCreateData(): CreateResponse {
    return CreateResponse(restaurantRepository.findAll())
  }

  fun getEditData(@PathVariable orderId: String): EditResponse {
    return EditResponse.create(orderRepository.findById(orderId).get())
  }
}
