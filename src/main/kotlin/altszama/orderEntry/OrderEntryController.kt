package altszama.orderEntry

import altszama.dish.DishService
import altszama.order.OrderRepository
import altszama.orderEntry.data.OrderEntrySaveRequest
import altszama.orderEntry.data.OrderEntryUpdateRequest
import altszama.orderEntry.data.OrderEntryCreateResponse
import altszama.orderEntry.data.OrderEntryEditResponse
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import javax.validation.Valid


@RestController
class OrderEntryController {

  @Autowired
  private lateinit var orderRepository: OrderRepository

  @Autowired
  private lateinit var orderEntryService: OrderEntryService

  @Autowired
  private lateinit var orderEntryRepository: OrderEntryRepository

  @Autowired
  private lateinit var dishService: DishService


  @RequestMapping(value = "/orders/{orderId}/create_entry.json")
  fun create(@PathVariable orderId: String): OrderEntryCreateResponse {
    val order = orderRepository.findOne(orderId)
    val allDishesInRestaurant = dishService.findByRestaurantId(order.restaurant.id)
    val allDishesInRestaurantByCategory = allDishesInRestaurant.groupBy { dish -> dish.category }
    val dishIdToSideDishesMap = orderEntryService.getDishToSideDishesMap(order.restaurant)

    return OrderEntryCreateResponse(order, allDishesInRestaurant, allDishesInRestaurantByCategory, dishIdToSideDishesMap)
  }

  @RequestMapping(value = "/order_entries/save")
  fun save(@RequestBody @Valid saveRequest: OrderEntrySaveRequest): ResponseEntity<String> {
    orderEntryService.saveEntry(saveRequest)
    return ResponseEntity(HttpStatus.OK)
  }

  @RequestMapping(value = "/order_entries/{orderEntryId}/edit_entry.json")
  fun edit(@PathVariable orderEntryId: String): OrderEntryEditResponse {
    val orderEntry = orderEntryRepository.findOne(orderEntryId)
    val order = orderEntry.order

    val allDishesInRestaurant = dishService.findByRestaurantId(order.restaurant.id)
    val allDishesInRestaurantByCategory = allDishesInRestaurant.groupBy { dish -> dish.category }
    val dishIdToSideDishesMap = orderEntryService.getDishToSideDishesMap(order.restaurant)

    return OrderEntryEditResponse(order, allDishesInRestaurant, allDishesInRestaurantByCategory, orderEntry, dishIdToSideDishesMap)
  }

  @RequestMapping(value = "/order_entries/update")
  fun update(@RequestBody @Valid updateRequest: OrderEntryUpdateRequest): ResponseEntity<String> {
    orderEntryService.updateEntry(updateRequest)
    return ResponseEntity(HttpStatus.OK)
  }

  @RequestMapping(value = "/order_entries/{orderEntryId}/delete")
  fun delete(@PathVariable orderEntryId: String): ResponseEntity<String> {
    orderEntryService.deleteOrderEntry(orderEntryId)
    return ResponseEntity(HttpStatus.OK)
  }

  @RequestMapping(value = "/order_entries/{orderEntryId}/mark_as_paid")
  fun setAsMarkedAsPaid(@PathVariable orderEntryId: String): ResponseEntity<String> {
    orderEntryService.setAsMarkedAsPaid(orderEntryId)
    return ResponseEntity(HttpStatus.OK)
  }

  @RequestMapping(value = "/order_entries/{orderEntryId}/confirm_as_paid")
  fun setAsConfirmedAsPaid(@PathVariable orderEntryId: String): ResponseEntity<String> {
    orderEntryService.setAsConfirmedAsPaid(orderEntryId)
    return ResponseEntity(HttpStatus.OK)
  }
}
