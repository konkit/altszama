package altszama.app.background

import altszama.app.order.OrderService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component

@Component
open class OrderCloser {

  @Autowired
  private lateinit var orderService: OrderService

  @Scheduled(cron = "0 0 * ? * *")
  fun check() {
    orderService.closePastOrders()
  }

}