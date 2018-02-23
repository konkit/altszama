package altszama.orderEntry

import altszama.auth.User
import org.springframework.data.mongodb.repository.MongoRepository


interface OrderEntryRepository : MongoRepository<OrderEntry, String> {
  fun findByOrderId(orderId: String): List<OrderEntry>

  fun findByUser(user: User): List<OrderEntry>

  fun deleteByOrderId(orderId: String)

  fun findByDishId(dishId: String): List<OrderEntry>
}
