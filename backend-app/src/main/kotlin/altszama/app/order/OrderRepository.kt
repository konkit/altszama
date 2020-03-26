package altszama.app.order

import altszama.app.auth.User
import org.springframework.data.mongodb.repository.MongoRepository
import java.time.LocalDate

interface OrderRepository : MongoRepository<Order, String> {
  fun findAllByOrderByOrderDateDesc(): List<Order>

  fun findByOrderDate(orderDate: LocalDate): List<Order>

  fun findByRestaurantId(restaurantId: String): List<Order>

  fun findByOrderStateNotInAndOrderDateBefore(states: List<OrderState>, beforeDate: LocalDate): List<Order>

  fun findTop10ByOrderCreatorOrderByOrderDateDesc(orderCreator: User): List<Order>
}
