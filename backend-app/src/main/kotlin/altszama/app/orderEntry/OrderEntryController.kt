package altszama.app.orderEntry

import altszama.app.orderEntry.dto.OrderEntrySaveRequest
import altszama.app.orderEntry.dto.OrderEntryUpdateRequest
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import javax.validation.Valid

@RestController
@RequestMapping("/api")
class OrderEntryController {

  @Autowired
  private lateinit var orderEntryService: OrderEntryService


  @PostMapping("/order_entries/save")
  fun save(@RequestBody @Valid saveRequest: OrderEntrySaveRequest): ResponseEntity<String> {
    orderEntryService.saveEntry(saveRequest)
    return ResponseEntity(HttpStatus.OK)
  }

  @PutMapping("/order_entries/update")
  fun update(@RequestBody @Valid updateRequest: OrderEntryUpdateRequest): ResponseEntity<String> {
    orderEntryService.updateEntry(updateRequest)
    return ResponseEntity(HttpStatus.OK)
  }

  @DeleteMapping("/order_entries/{orderEntryId}/dish_entry/{dishEntryId}/delete")
  fun delete(@PathVariable orderEntryId: String, @PathVariable dishEntryId: String): ResponseEntity<String> {
    orderEntryService.deleteOrderEntry(orderEntryId, dishEntryId)
    return ResponseEntity(HttpStatus.OK)
  }

  @PutMapping("/order_entries/{orderEntryId}/mark_as_paid")
  fun setAsMarkedAsPaid(@PathVariable orderEntryId: String): ResponseEntity<String> {
    orderEntryService.setAsMarkedAsPaid(orderEntryId)
    return ResponseEntity(HttpStatus.OK)
  }

  @PutMapping("/order_entries/{orderEntryId}/confirm_as_paid")
  fun setAsConfirmedAsPaid(@PathVariable orderEntryId: String): ResponseEntity<String> {
    orderEntryService.setAsConfirmedAsPaid(orderEntryId)
    return ResponseEntity(HttpStatus.OK)
  }
}
