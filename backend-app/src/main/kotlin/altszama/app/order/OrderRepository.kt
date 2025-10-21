package altszama.app.order

import altszama.app.auth.User
import altszama.app.team.Team
import org.springframework.data.mongodb.repository.MongoRepository
import java.time.LocalDate

interface OrderRepository : MongoRepository<Order, String> {
  fun findByTeamAndOrderDate(currentUserTeam: Team, orderDate: LocalDate): List<Order>

  fun findAllByTeamOrderByOrderDateDesc(currentUserTeam: Team): List<Order>

  fun findByRestaurantId(restaurantId: String): List<Order>

  fun findByOrderStateNotInAndOrderDateBefore(states: List<OrderState>, beforeDate: LocalDate): List<Order>

  fun findByOrderCreator(orderCreator: User): List<Order>

  fun findTop10ByOrderCreatorOrderByOrderDateDesc(orderCreator: User): List<Order>
}
