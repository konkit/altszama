package altszama.app.balance

import altszama.app.order.OrderService
import altszama.app.orderEntry.OrderEntryPaymentStatus
import altszama.app.orderEntry.OrderEntryService
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

  @Autowired
  private lateinit var orderService: OrderService

  @Autowired
  private lateinit var orderEntryService: OrderEntryService

  @Test()
  fun itShouldReturnEmptyList() {
    val team1 = teamService.createTeam("team1.com", "team1.com")
    val (_, user) = createUserAndGetToken("John", "john@team1.com")

    val result = balanceService.getOrderHistory(user)

    assertThat(result.entries).isEmpty()
    assertThat(result.owedMoney).isEmpty()
  }

  @Test()
  fun itShouldReturnProperHistoryForOneCreatedOrder() {
    val team1 = teamService.createTeam("team1.com", "team1.com")
    val (_, user) = createUserAndGetToken("John1", "john@team1.com")

    val (restaurant, dishes) = createRestaurantAndDishes(team1)
    val order = createOrder(restaurant, user, team1)
    val orderEntry1 = createOrderEntry(order, dishes[0], user, team1)

    val (_, user2) = createUserAndGetToken("John2", "john2@team1.com")
    val orderEntry2 = createOrderEntry(order, dishes[0], user2, team1)

    orderService.setAsOrdered(order.id, "", user)

    val result = balanceService.getOrderHistory(user)

    val expectedCreatedEntry = OrderHistoryCreatedEntry(
      orderId = order.id,
      orderDate = order.orderDate,
      orderCreator = order.orderCreator.username,
      restaurantName = order.restaurant.name,
      confirmedPaymentsTotalAmount = dishes[0].price,
      totalAmount = dishes[0].price * 2
    )
    assertThat(result.entries).isEqualTo(listOf(expectedCreatedEntry))
    assertThat(result.owedMoney).isEqualTo(mapOf("John2" to dishes[0].price))
  }

  @Test()
  fun itShouldReturnProperHistoryForOneParticipatedOrder() {
    val team1 = teamService.createTeam("team1.com", "team1.com")
    val (_, user1) = createUserAndGetToken("John1", "john1@team1.com")

    val (restaurant, dishes) = createRestaurantAndDishes(team1)
    val order = createOrder(restaurant, user1, team1)

    val (_, user2) = createUserAndGetToken("John2", "john2@team1.com")
    val orderEntry = createOrderEntry(order, dishes[0], user2, team1)

    orderService.setAsOrdered(order.id, "", user1)

    val result = balanceService.getOrderHistory(user2)

    val expectedParticipatedEntry = OrderHistoryParticipatedEntry(
      orderId = orderEntry.order.id,
      orderDate = order.orderDate,
      orderCreator = order.orderCreator.username,
      restaurantName = order.restaurant.name,
      orderEntryAmount = dishes[0].price,
      status = OrderEntryPaymentStatus.UNPAID
    )
    assertThat(result.entries).isEqualTo(listOf(expectedParticipatedEntry))

    assertThat(result.owedMoney).isEqualTo(mapOf("John1" to -dishes[0].price))
  }

  @Test()
  fun itShouldReturnProperHistoryForOneOrderMadeByOneUserAndAnotherMadeByAnotherOne() {
    val team1 = teamService.createTeam("team1.com", "team1.com")
    val (_, user1) = createUserAndGetToken("John1", "john1@team1.com")

    val (_, user2) = createUserAndGetToken("John2", "john2@team1.com")

    val (restaurant, dishes) = createRestaurantAndDishes(team1)
    val order = createOrder(restaurant, user1, team1)
    val orderEntry1 = createOrderEntry(order, dishes[0], user1, team1)
    val orderEntry2 = createOrderEntry(order, dishes[0], user2, team1)

    orderService.setAsOrdered(order.id, "", user1)


    val order2 = createOrder(restaurant, user2, team1)
    val orderEntry3 = createOrderEntry(order2, dishes[1], user1, team1)
    val orderEntry4 = createOrderEntry(order2, dishes[1], user2, team1)

    orderService.setAsOrdered(order2.id, "", user2)


    val resultUser1 = balanceService.getOrderHistory(user1)
    val expectedCreatedEntry = OrderHistoryCreatedEntry(
      orderId = order.id,
      orderDate = order.orderDate,
      orderCreator = order.orderCreator.username,
      restaurantName = order.restaurant.name,
      confirmedPaymentsTotalAmount = dishes[0].price,
      totalAmount = dishes[0].price * 2
    )
    val expectedParticipatedEntry = OrderHistoryParticipatedEntry(
      orderId = order2.id,
      orderDate = order2.orderDate,
      orderCreator = order2.orderCreator.username,
      restaurantName = order2.restaurant.name,
      orderEntryAmount = dishes[1].price,
      status = OrderEntryPaymentStatus.UNPAID
    )
    assertThat(resultUser1.entries).isEqualTo(listOf(expectedCreatedEntry, expectedParticipatedEntry))
    assertThat(resultUser1.owedMoney).isEqualTo(mapOf("John2" to dishes[0].price - dishes[1].price))


    val resultUser2 = balanceService.getOrderHistory(user2)
    val expectedParticipatedEntry2 = OrderHistoryParticipatedEntry(
      orderId = order.id,
      orderDate = order.orderDate,
      orderCreator = order.orderCreator.username,
      restaurantName = order.restaurant.name,
      orderEntryAmount = dishes[0].price,
      status = OrderEntryPaymentStatus.UNPAID
    )
    val expectedCreatedEntry2 = OrderHistoryCreatedEntry(
      orderId = order2.id,
      orderDate = order2.orderDate,
      orderCreator = order2.orderCreator.username,
      restaurantName = order2.restaurant.name,
      confirmedPaymentsTotalAmount = dishes[1].price,
      totalAmount = dishes[1].price * 2
    )
    assertThat(resultUser2.entries).isEqualTo(listOf(expectedCreatedEntry2, expectedParticipatedEntry2))
    assertThat(resultUser2.owedMoney).isEqualTo(mapOf("John1" to dishes[1].price - dishes[0].price))
  }

  @Test()
  fun itShouldReturnProperHistoryEntriesInTwoOrdersAreAlreadyPaid() {
    val team1 = teamService.createTeam("team1.com", "team1.com")
    val (_, user1) = createUserAndGetToken("John1", "john1@team1.com")

    val (_, user2) = createUserAndGetToken("John2", "john2@team1.com")

    val (restaurant, dishes) = createRestaurantAndDishes(team1)
    val order = createOrder(restaurant, user1, team1)
    val orderEntry1 = createOrderEntry(order, dishes[0], user1, team1)
    val orderEntry2 = createOrderEntry(order, dishes[0], user2, team1)

    orderService.setAsOrdered(order.id, "", user1)
    orderEntryService.setAsConfirmedAsPaid(orderEntry1.id)
    orderEntryService.setAsConfirmedAsPaid(orderEntry2.id)


    val order2 = createOrder(restaurant, user2, team1)
    val orderEntry3 = createOrderEntry(order2, dishes[1], user1, team1)
    val orderEntry4 = createOrderEntry(order2, dishes[1], user2, team1)

    orderService.setAsOrdered(order2.id, "", user2)
    orderEntryService.setAsConfirmedAsPaid(orderEntry3.id)
    orderEntryService.setAsConfirmedAsPaid(orderEntry4.id)


    val resultUser1 = balanceService.getOrderHistory(user1)
    val expectedCreatedEntry = OrderHistoryCreatedEntry(
      orderId = order.id,
      orderDate = order.orderDate,
      orderCreator = order.orderCreator.username,
      restaurantName = order.restaurant.name,
      confirmedPaymentsTotalAmount = dishes[0].price * 2,
      totalAmount = dishes[0].price * 2
    )
    val expectedParticipatedEntry = OrderHistoryParticipatedEntry(
      orderId = order2.id,
      orderDate = order2.orderDate,
      orderCreator = order2.orderCreator.username,
      restaurantName = order2.restaurant.name,
      orderEntryAmount = dishes[1].price,
      status = OrderEntryPaymentStatus.CONFIRMED
    )
    assertThat(resultUser1.entries).isEqualTo(listOf(expectedCreatedEntry, expectedParticipatedEntry))
    assertThat(resultUser1.owedMoney).isEqualTo(emptyMap<String, Int>())


    val resultUser2 = balanceService.getOrderHistory(user2)
    val expectedParticipatedEntry2 = OrderHistoryParticipatedEntry(
      orderId = order.id,
      orderDate = order.orderDate,
      orderCreator = order.orderCreator.username,
      restaurantName = order.restaurant.name,
      orderEntryAmount = dishes[0].price,
      status = OrderEntryPaymentStatus.CONFIRMED
    )
    val expectedCreatedEntry2 = OrderHistoryCreatedEntry(
      orderId = order2.id,
      orderDate = order2.orderDate,
      orderCreator = order2.orderCreator.username,
      restaurantName = order2.restaurant.name,
      confirmedPaymentsTotalAmount = dishes[1].price  * 2,
      totalAmount = dishes[1].price * 2
    )
    assertThat(resultUser2.entries).isEqualTo(listOf(expectedCreatedEntry2, expectedParticipatedEntry2))
    assertThat(resultUser2.owedMoney).isEqualTo(emptyMap<String, Int>())
  }

  @Test()
  fun itShouldReturnEmptyListIfCreatedOrderIsInCreatedState() {
    val team1 = teamService.createTeam("team1.com", "team1.com")
    val (_, user) = createUserAndGetToken("John", "john@team1.com")

    val (restaurant, dishes) = createRestaurantAndDishes(team1)
    val order = createOrder(restaurant, user, team1)
    val orderEntry = createOrderEntry(order, dishes[0], user, team1)

    val result = balanceService.getOrderHistory(user)

    assertThat(result.entries).isEqualTo(emptyList<OrderHistoryEntry>())
    assertThat(result.owedMoney).isEqualTo(emptyMap<String, Int>())
  }

  @Test()
  fun itShouldReturnEmptyListIfCreatedOrderIsInOrderingState() {
    val team1 = teamService.createTeam("team1.com", "team1.com")
    val (_, user) = createUserAndGetToken("John", "john@team1.com")

    val (restaurant, dishes) = createRestaurantAndDishes(team1)
    val order = createOrder(restaurant, user, team1)
    val orderEntry = createOrderEntry(order, dishes[0], user, team1)

    orderService.setAsOrdering(order.id, user)

    val result = balanceService.getOrderHistory(user)

    assertThat(result.entries).isEqualTo(emptyList<OrderHistoryEntry>())
    assertThat(result.owedMoney).isEqualTo(emptyMap<String, Int>())
  }

  @Test()
  fun itShouldReturnEmptyListIfCreatedOrderIsInRejectedState() {
    val team1 = teamService.createTeam("team1.com", "team1.com")
    val (_, user) = createUserAndGetToken("John", "john@team1.com")

    val (restaurant, dishes) = createRestaurantAndDishes(team1)
    val order = createOrder(restaurant, user, team1)
    val orderEntry = createOrderEntry(order, dishes[0], user, team1)

    orderService.setAsRejected(order.id, user)

    val result = balanceService.getOrderHistory(user)

    assertThat(result.entries).isEqualTo(emptyList<OrderHistoryEntry>())
    assertThat(result.owedMoney).isEqualTo(emptyMap<String, Int>())
  }

  @Test()
  fun itShouldReturnEmptyListIfParticipatedOrderIsInCreatedState() {
    val team1 = teamService.createTeam("team1.com", "team1.com")
    val (_, user1) = createUserAndGetToken("John", "john1@team1.com")

    val (restaurant, dishes) = createRestaurantAndDishes(team1)
    val order = createOrder(restaurant, user1, team1)

    val (_, user2) = createUserAndGetToken("John", "john2@team1.com")
    val orderEntry = createOrderEntry(order, dishes[0], user2, team1)

    val result = balanceService.getOrderHistory(user2)

    assertThat(result.entries).isEqualTo(emptyList<OrderHistoryEntry>())
    assertThat(result.owedMoney).isEqualTo(emptyMap<String, Int>())
  }

  @Test()
  fun itShouldReturnEmptyListIfParticipatedOrderIsInOrderingState() {
    val team1 = teamService.createTeam("team1.com", "team1.com")
    val (_, user1) = createUserAndGetToken("John", "john1@team1.com")

    val (restaurant, dishes) = createRestaurantAndDishes(team1)
    val order = createOrder(restaurant, user1, team1)

    val (_, user2) = createUserAndGetToken("John", "john2@team1.com")
    val orderEntry = createOrderEntry(order, dishes[0], user2, team1)

    orderService.setAsOrdering(order.id, user1)

    val result = balanceService.getOrderHistory(user2)

    assertThat(result.entries).isEqualTo(emptyList<OrderHistoryEntry>())
    assertThat(result.owedMoney).isEqualTo(emptyMap<String, Int>())
  }

  @Test()
  fun itShouldReturnEmptyListIfParticipatedOrderIsInRejectedState() {
    val team1 = teamService.createTeam("team1.com", "team1.com")
    val (_, user1) = createUserAndGetToken("John", "john1@team1.com")

    val (restaurant, dishes) = createRestaurantAndDishes(team1)
    val order = createOrder(restaurant, user1, team1)

    val (_, user2) = createUserAndGetToken("John", "john2@team1.com")
    val orderEntry = createOrderEntry(order, dishes[0], user2, team1)

    orderService.setAsRejected(order.id, user1)

    val result = balanceService.getOrderHistory(user2)

    assertThat(result.entries).isEqualTo(emptyList<OrderHistoryEntry>())
    assertThat(result.owedMoney).isEqualTo(emptyMap<String, Int>())
  }

}