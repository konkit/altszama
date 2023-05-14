package altszama.app.orderEntry

import altszama.app.auth.User
import org.bson.types.ObjectId
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.data.mongodb.repository.Query


interface OrderEntryRepository : MongoRepository<OrderEntry, String> {
  fun findByOrderId(orderId: String): List<OrderEntry>

  fun countByOrderId(orderId: String): Int

  fun findByOrderIdAndUser(orderId: String, user: User): OrderEntry?

  fun findByUser(user: User): List<OrderEntry>

  fun deleteByOrderId(orderId: String)

  @Query(value = "{'dishEntries.dish._id' : ?0}")
  fun findByDishIdQuery(dishId: ObjectId): List<OrderEntry>
}
