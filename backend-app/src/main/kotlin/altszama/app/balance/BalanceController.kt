package altszama.app.balance

import altszama.app.utils.CurrentUserService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api")
class BalanceController {

  @Autowired
  private lateinit var currentUserService: CurrentUserService

  @Autowired
  private lateinit var balanceService: BalanceService

  @GetMapping("/balance/getForUser")
  fun getBalanceForUser(): ResponseEntity<OrderHistory> {
    val currentUser = currentUserService.getCurrentUser()
    val orderHistory = balanceService.getOrderHistory(currentUser)
    return ResponseEntity(orderHistory, HttpStatus.OK)
  }

}