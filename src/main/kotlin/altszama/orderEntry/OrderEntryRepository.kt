package altszama.orderEntry

import altszama.auth.User
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.data.mongodb.repository.Query


interface OrderEntryRepository : MongoRepository<OrderEntry, String> {
  fun findByOrderId(orderId: String): List<OrderEntry>

  fun findByOrderIdAndUser(orderId: String, user: User): OrderEntry?

  fun findByUser(user: User): List<OrderEntry>

  fun deleteByOrderId(orderId: String)

  @Query(value = "{'dishEntries' : ?0}")
  fun findByDishId(dishId: String): List<OrderEntry>
}
