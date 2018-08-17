package altszama.order

import altszama.auth.AuthService
import altszama.dish.DishService
import altszama.order.dto.*
import altszama.orderEntry.OrderEntryRepository
import altszama.orderEntry.OrderEntryService
import altszama.restaurant.RestaurantRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.time.LocalDate
import javax.validation.Valid


@RestController
class OrderController {

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


  @RequestMapping("/orders.json")
  fun index(): IndexResponse {
    val currentUser = authService.currentUser()

    val todaysOrders = orderRepository.findByOrderDate(LocalDate.now())
    val usersOrderEntries = orderEntryRepository.findByUser(currentUser)

    return IndexResponse.create(todaysOrders, usersOrderEntries)
  }

  @RequestMapping("/orders/all.json")
  fun allOrders(): AllOrdersResponse {
    return AllOrdersResponse(orderRepository.findAll())
  }

  @RequestMapping("/orders/{orderId}/show.json")
  fun show(@PathVariable orderId: String): ShowResponse {
    val currentUserId = authService.currentUser().id

    val order = orderRepository.findById(orderId).get()
    val entries = orderEntryRepository.findByOrderId(orderId)

    val allDishesInRestaurant = dishService.findByRestaurantId(order.restaurant.id)

    val dishIdToSideDishesMap = orderEntryService.getDishToSideDishesMap(order.restaurant)

    return ShowResponse.create(order, entries, currentUserId, allDishesInRestaurant, dishIdToSideDishesMap)
  }

  @RequestMapping("/orders/{orderId}/order_view.json")
  fun orderViewJson(@PathVariable orderId: String): OrderViewResponse {
    orderService.setAsOrdering(orderId)

    val order = orderRepository.findById(orderId).get()
    val entries = orderEntryRepository.findByOrderId(orderId)

    return OrderViewResponse.create(order, entries)
  }

  @RequestMapping("/orders/create.json")
  fun create(): CreateResponse {
    return CreateResponse(restaurantRepository.findAll())
  }

  @RequestMapping("/orders/save")
  fun save(@RequestBody @Valid orderSaveRequest: OrderSaveRequest): ResponseEntity<String> {
    orderService.saveOrder(orderSaveRequest)
    return ResponseEntity(HttpStatus.OK)
  }

  @RequestMapping("/orders/{orderId}/edit.json")
  fun edit(@PathVariable orderId: String): EditResponse {
    return EditResponse(orderRepository.findById(orderId).get(), restaurantRepository.findAll())
  }

  @RequestMapping("/orders/update")
  fun update(@RequestBody @Valid orderUpdateRequest: OrderUpdateRequest): ResponseEntity<String> {
    orderService.updateOrder(orderUpdateRequest)
    return ResponseEntity(HttpStatus.OK)
  }

  @RequestMapping("/orders/{orderId}/delete")
  fun delete(@PathVariable orderId: String): ResponseEntity<String> {
    orderService.deleteOrder(orderId)
    return ResponseEntity(HttpStatus.OK)
  }

  @RequestMapping("/orders/{orderId}/set_as_created")
  fun setAsCreated(@PathVariable orderId: String): ResponseEntity<String> {
    orderService.setAsCreated(orderId)
    return ResponseEntity(HttpStatus.OK)
  }

  @RequestMapping("/orders/{orderId}/set_as_ordering")
  fun setAsOrdering(@PathVariable orderId: String): ResponseEntity<String> {
    orderService.setAsOrdering(orderId)
    return ResponseEntity(HttpStatus.OK)
  }

  @RequestMapping("/orders/{orderId}/set_as_ordered")
  fun setAsOrdered(@PathVariable orderId: String, @RequestBody requestResponse: SetAsOrderedResponse): ResponseEntity<String> {
    orderService.setAsOrdered(orderId, requestResponse.approxTimeOfDelivery)
    return ResponseEntity(HttpStatus.OK)
  }

  @RequestMapping("/orders/{orderId}/set_back_as_ordered")
  fun setAsOrdered(@PathVariable orderId: String): ResponseEntity<String> {
    orderService.setBackAsOrdered(orderId)
    return ResponseEntity(HttpStatus.OK)
  }

  @RequestMapping("/orders/{orderId}/set_as_delivered")
  fun setAsDelivered(@PathVariable orderId: String): ResponseEntity<String> {
    orderService.setAsDelivered(orderId)
    return ResponseEntity(HttpStatus.OK)
  }

  @RequestMapping("/orders/{orderId}/set_as_rejected")
  fun setAsRejected(@PathVariable orderId: String): ResponseEntity<String> {
    orderService.setAsRejected(orderId)
    return ResponseEntity(HttpStatus.OK)
  }
}
