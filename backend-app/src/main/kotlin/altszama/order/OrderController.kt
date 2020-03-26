package altszama.order

import altszama.order.dto.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import javax.validation.Valid

@RestController
@RequestMapping("/api")
class OrderController {

  @Autowired
  private lateinit var orderService: OrderService

  @Autowired
  private lateinit var orderControllerDataService: OrderControllerDataService


  @RequestMapping("/orders/today.json")
  fun todayOrders(): TodayOrdersResponse {
    return orderControllerDataService.getIndexData()
  }

  @RequestMapping("/orders/all.json")
  fun allOrders(): AllOrdersResponse {
    return orderControllerDataService.getAllOrdersData()
  }

  @RequestMapping("/orders/{orderId}/show.json")
  fun show(@PathVariable orderId: String): ShowResponse {
    return orderControllerDataService.getShowData(orderId)
  }

  @RequestMapping("/orders/{orderId}/order_view.json")
  fun orderViewJson(@PathVariable orderId: String): OrderViewResponse {
    return orderControllerDataService.getOrderViewData(orderId)
  }

  @RequestMapping("/orders/create.json")
  fun create(): CreateResponse {
    return orderControllerDataService.getCreateData()
  }

  @RequestMapping("/orders/save")
  fun save(@RequestBody @Valid orderSaveRequest: OrderSaveRequest): ResponseEntity<String> {
    orderService.saveOrder(orderSaveRequest)
    return ResponseEntity(HttpStatus.OK)
  }

  @RequestMapping("/orders/{orderId}/edit.json")
  fun edit(@PathVariable orderId: String): EditResponse {
    return orderControllerDataService.getEditData(orderId)
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
