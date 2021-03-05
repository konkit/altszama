package altszama.app.order

import altszama.app.auth.UserService
import altszama.app.order.dto.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import javax.validation.Valid

@RestController
@RequestMapping("/api")
class OrderController {

  @Autowired
  private lateinit var userService: UserService

  @Autowired
  private lateinit var orderService: OrderService

  @Autowired
  private lateinit var orderControllerDataService: OrderControllerDataService


  @GetMapping("/orders/today.json")
  fun todayOrders(): TodayOrdersResponse {
    val currentUser = userService.currentUser()
    return orderControllerDataService.getIndexData(currentUser)
  }

  @GetMapping("/orders/all.json")
  fun allOrders(): AllOrdersResponse {
    return orderControllerDataService.getAllOrdersData()
  }

  @GetMapping("/orders/{orderId}/show.json")
  fun show(@PathVariable orderId: String): ShowOrderResponse {
    val currentUser = userService.currentUser()
    return orderControllerDataService.getShowData(orderId, currentUser)
  }

  @GetMapping("/orders/{orderId}/order_view.json")
  fun orderViewJson(@PathVariable orderId: String): OrderViewInitialData {
    val currentUser = userService.currentUser()
    return orderControllerDataService.getOrderViewData(orderId, currentUser)
  }

  @GetMapping("/orders/create.json")
  fun create(): CreateOrderInitialData {
    val currentUser = userService.currentUser()
    return orderControllerDataService.getCreateData(currentUser)
  }

  @PostMapping("/orders/save")
  fun save(@RequestBody @Valid orderSaveRequest: OrderSaveRequest): ResponseEntity<String> {
    val currentUser = userService.currentUser()
    orderService.saveOrder(orderSaveRequest, currentUser)
    return ResponseEntity("{}", HttpStatus.OK)
  }

  @GetMapping("/orders/{orderId}/edit.json")
  fun edit(@PathVariable orderId: String): EditOrderInitialData {
    return orderControllerDataService.getEditData(orderId)
  }

  @PutMapping("/orders/update")
  fun update(@RequestBody @Valid orderUpdateRequest: OrderUpdateRequest): ResponseEntity<String> {
    orderService.updateOrder(orderUpdateRequest)
    return ResponseEntity("{}", HttpStatus.OK)
  }

  @DeleteMapping("/orders/{orderId}/delete")
  fun delete(@PathVariable orderId: String): ResponseEntity<String> {
    val currentUser = userService.currentUser()
    orderService.deleteOrder(orderId, currentUser)
    return ResponseEntity("{}", HttpStatus.OK)
  }

  @PutMapping("/orders/{orderId}/set_as_created")
  fun setAsCreated(@PathVariable orderId: String): ResponseEntity<String> {
    val currentUser = userService.currentUser()
    orderService.setAsCreated(orderId, currentUser)
    return ResponseEntity("{}", HttpStatus.OK)
  }

  @PutMapping("/orders/{orderId}/set_as_ordering")
  fun setAsOrdering(@PathVariable orderId: String): ResponseEntity<String> {
    val currentUser = userService.currentUser()
    orderService.setAsOrdering(orderId, currentUser)
    return ResponseEntity("{}", HttpStatus.OK)
  }

  @PutMapping("/orders/{orderId}/set_as_ordered")
  fun setAsOrdered(@PathVariable orderId: String, @RequestBody requestResponse: SetAsOrderedResponse): ResponseEntity<String> {
    val currentUser = userService.currentUser()
    orderService.setAsOrdered(orderId, requestResponse.approxTimeOfDelivery, currentUser)
    return ResponseEntity("{}", HttpStatus.OK)
  }

  @PutMapping("/orders/{orderId}/set_back_as_ordered")
  fun setBackAsOrdered(@PathVariable orderId: String): ResponseEntity<String> {
    val currentUser = userService.currentUser()
    orderService.setBackAsOrdered(orderId, currentUser)
    return ResponseEntity("{}", HttpStatus.OK)
  }

  @PutMapping("/orders/{orderId}/set_as_delivered")
  fun setAsDelivered(@PathVariable orderId: String): ResponseEntity<String> {
    val currentUser = userService.currentUser()
    orderService.setAsDelivered(orderId, currentUser)
    return ResponseEntity("{}", HttpStatus.OK)
  }

  @PutMapping("/orders/{orderId}/set_as_rejected")
  fun setAsRejected(@PathVariable orderId: String): ResponseEntity<String> {
    val currentUser = userService.currentUser()
    orderService.setAsRejected(orderId, currentUser)
    return ResponseEntity("{}", HttpStatus.OK)
  }
}
