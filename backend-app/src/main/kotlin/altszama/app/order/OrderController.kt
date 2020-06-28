package altszama.app.order

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
  private lateinit var orderService: OrderService

  @Autowired
  private lateinit var orderControllerDataService: OrderControllerDataService


  @GetMapping("/orders/today.json")
  fun todayOrders(): TodayOrdersResponse {
    return orderControllerDataService.getIndexData()
  }

  @GetMapping("/orders/all.json")
  fun allOrders(): AllOrdersResponse {
    return orderControllerDataService.getAllOrdersData()
  }

  @GetMapping("/orders/{orderId}/show.json")
  fun show(@PathVariable orderId: String): ShowOrderResponse {
    return orderControllerDataService.getShowData(orderId)
  }

  @GetMapping("/orders/{orderId}/order_view.json")
  fun orderViewJson(@PathVariable orderId: String): OrderViewResponse {
    return orderControllerDataService.getOrderViewData(orderId)
  }

  @GetMapping("/orders/create.json")
  fun create(): CreateOrderResponse {
    return orderControllerDataService.getCreateData()
  }

  @PostMapping("/orders/save")
  fun save(@RequestBody @Valid orderSaveRequest: OrderSaveRequest): ResponseEntity<String> {
    orderService.saveOrder(orderSaveRequest)
    return ResponseEntity("{}", HttpStatus.OK)
  }

  @GetMapping("/orders/{orderId}/edit.json")
  fun edit(@PathVariable orderId: String): EditOrderResponse {
    return orderControllerDataService.getEditData(orderId)
  }

  @PutMapping("/orders/update")
  fun update(@RequestBody @Valid orderUpdateRequest: OrderUpdateRequest): ResponseEntity<String> {
    orderService.updateOrder(orderUpdateRequest)
    return ResponseEntity("{}", HttpStatus.OK)
  }

  @DeleteMapping("/orders/{orderId}/delete")
  fun delete(@PathVariable orderId: String): ResponseEntity<String> {
    orderService.deleteOrder(orderId)
    return ResponseEntity("{}", HttpStatus.OK)
  }

  @PutMapping("/orders/{orderId}/set_as_created")
  fun setAsCreated(@PathVariable orderId: String): ResponseEntity<String> {
    orderService.setAsCreated(orderId)
    return ResponseEntity("{}", HttpStatus.OK)
  }

  @PutMapping("/orders/{orderId}/set_as_ordering")
  fun setAsOrdering(@PathVariable orderId: String): ResponseEntity<String> {
    orderService.setAsOrdering(orderId)
    return ResponseEntity("{}", HttpStatus.OK)
  }

  @PutMapping("/orders/{orderId}/set_as_ordered")
  fun setAsOrdered(@PathVariable orderId: String, @RequestBody requestResponse: SetAsOrderedResponse): ResponseEntity<String> {
    orderService.setAsOrdered(orderId, requestResponse.approxTimeOfDelivery)
    return ResponseEntity("{}", HttpStatus.OK)
  }

  @PutMapping("/orders/{orderId}/set_back_as_ordered")
  fun setBackAsOrdered(@PathVariable orderId: String): ResponseEntity<String> {
    orderService.setBackAsOrdered(orderId)
    return ResponseEntity("{}", HttpStatus.OK)
  }

  @PutMapping("/orders/{orderId}/set_as_delivered")
  fun setAsDelivered(@PathVariable orderId: String): ResponseEntity<String> {
    orderService.setAsDelivered(orderId)
    return ResponseEntity("{}", HttpStatus.OK)
  }

  @PutMapping("/orders/{orderId}/set_as_rejected")
  fun setAsRejected(@PathVariable orderId: String): ResponseEntity<String> {
    orderService.setAsRejected(orderId)
    return ResponseEntity("{}", HttpStatus.OK)
  }
}
