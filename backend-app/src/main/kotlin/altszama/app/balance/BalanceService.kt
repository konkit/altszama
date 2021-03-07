package altszama.app.balance

import altszama.app.auth.User
import altszama.app.order.OrderRepository
import altszama.app.orderEntry.OrderEntryRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class BalanceService {

  @Autowired
  private lateinit var orderRepository: OrderRepository

  @Autowired
  private lateinit var orderEntryRepository: OrderEntryRepository

  fun getBalance(currentUser: User) {
    val orderEntriesYouOwe = orderEntryRepository.findByUser(currentUser)
    val orderEntriesYouAreOwed = orderRepository.findByOrderCreator(currentUser)


  }
}
