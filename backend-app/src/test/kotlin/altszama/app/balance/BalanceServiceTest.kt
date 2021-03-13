package altszama.app.balance

import altszama.app.orderEntry.OrderEntryPaymentStatus
import altszama.app.team.TeamService
import altszama.app.test.AbstractIntegrationTest
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired

class BalanceServiceTest : AbstractIntegrationTest() {

  @Autowired
  private lateinit var balanceService: BalanceService

  @Autowired
  private lateinit var teamService: TeamService

  @Test()
  fun itShouldReturnEmptyList() {
    val team1 = teamService.createTeam("team1.com", "team1.com")
    val (_, user) = createUserAndGetToken("John", "john@team1.com")

    val result = balanceService.getOrderHistory(user)

    assertThat(result.createdEntries).isEmpty()
    assertThat(result.participatedEntries).isEmpty()
  }

  @Test()
  fun itShouldReturnProperHistoryForOneCreatedOrder() {
    val team1 = teamService.createTeam("team1.com", "team1.com")
    val (_, user) = createUserAndGetToken("John", "john@team1.com")

    val (restaurant, dishes) = createRestaurantAndDishes(team1)
    val order = createOrder(restaurant, user, team1)
    val orderEntry = createOrderEntry(order, dishes[0], user, team1)

    val result = balanceService.getOrderHistory(user)

    val expectedCreatedEntry = OrderHistoryCreatedEntry(
      order.id,
      order.orderDate,
      order.restaurant.name,
      0,
      0,
      0,
      dishes[0].price
    )
    assertThat(result.createdEntries).isEqualTo(listOf(expectedCreatedEntry))

    val expectedParticipatedEntry = OrderHistoryParticipatedEntry(
      orderEntry.id,
      order.orderDate,
      order.restaurant.name,
      100,
      OrderEntryPaymentStatus.UNPAID
    )
    assertThat(result.participatedEntries).isEqualTo(listOf(expectedParticipatedEntry))
  }

  @Test()
  fun itShouldReturnProperHistoryForOneParticipatedOrder() {
    val team1 = teamService.createTeam("team1.com", "team1.com")
    val (_, user1) = createUserAndGetToken("John", "john1@team1.com")

    val (restaurant, dishes) = createRestaurantAndDishes(team1)
    val order = createOrder(restaurant, user1, team1)

    val (_, user2) = createUserAndGetToken("John", "john2@team1.com")
    val orderEntry = createOrderEntry(order, dishes[0], user2, team1)

    val result = balanceService.getOrderHistory(user2)

    assertThat(result.createdEntries).isEmpty()

    val expectedParticipatedEntry = OrderHistoryParticipatedEntry(
      orderEntry.id,
      order.orderDate,
      order.restaurant.name,
      100,
      OrderEntryPaymentStatus.UNPAID
    )
    assertThat(result.participatedEntries).isEqualTo(listOf(expectedParticipatedEntry))
  }

}