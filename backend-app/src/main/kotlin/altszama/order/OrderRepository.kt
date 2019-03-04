package altszama.order

import org.springframework.data.mongodb.repository.MongoRepository
import java.time.LocalDate

interface OrderRepository : MongoRepository<Order, String> {
  fun findAllByOrderByOrderDateDesc(): List<Order>

  fun findByOrderDate(orderDate: LocalDate): List<Order>

  fun findByRestaurantId(restaurantId: String): List<Order>

  fun findByOrderStateNotInAndOrderDateBefore(states: List<OrderState>, beforeDate: LocalDate): List<Order>
}
