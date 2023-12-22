package altszama.app.balance

import altszama.app.order.OrderService
import altszama.app.orderEntry.OrderEntryService
import altszama.app.test.AbstractIntegrationTest
import altszama.app.test.TestFactoriesService
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired

class BalanceServiceTest : AbstractIntegrationTest() {

  @Autowired
  private lateinit var balanceService: BalanceService

  @Autowired
  private lateinit var orderService: OrderService

  @Autowired
  private lateinit var orderEntryService: OrderEntryService

  @Autowired
  private lateinit var testFactoriesService: TestFactoriesService

  @Test()
  fun itShouldReturnEmptyList() {
    val team1 = testFactoriesService.createTeam1()
    val user = testFactoriesService.createUser1(team1)

    val orderHistory = balanceService.getOrderHistory(user)

    assertThat(orderHistory.owedMoney).isEmpty()
  }

  @Test()
  fun itShouldReturnProperHistoryForOneCreatedOrder() {
    val team1 = testFactoriesService.createTeam1()
    val user = testFactoriesService.createUser1(team1)

    val (restaurant, dishes) = testFactoriesService.createRestaurantAndDishes(team1)
    val order = testFactoriesService.createOrder(restaurant, user, team1)
    val orderEntry1 = testFactoriesService.createOrderEntry(order, dishes[0], user, team1)

    val user2 = testFactoriesService.createUser2(team1)
    val orderEntry2 = testFactoriesService.createOrderEntry(order, dishes[0], user2, team1)

    orderService.setAsOrdered(order.id, "", user)

    val orderHistory = balanceService.getOrderHistory(user)

    assertThat(orderHistory.owedMoney).isEqualTo(mapOf(user2.username to dishes[0].price))
  }

  @Test()
  fun itShouldReturnProperHistoryForOneParticipatedOrder() {
    val team1 = testFactoriesService.createTeam1()
    val user1 = testFactoriesService.createUser1(team1)

    val (restaurant, dishes) = testFactoriesService.createRestaurantAndDishes(team1)
    val order = testFactoriesService.createOrder(restaurant, user1, team1)

    val user2 = testFactoriesService.createUser2(team1)
    val orderEntry = testFactoriesService.createOrderEntry(order, dishes[0], user2, team1)

    orderService.setAsOrdered(order.id, "", user1)

    val orderHistory = balanceService.getOrderHistory(user2)

    assertThat(orderHistory.owedMoney).isEqualTo(mapOf(user1.username to -dishes[0].price))
  }

  @Test()
  fun itShouldReturnProperHistoryForOneOrderMadeByOneUserAndAnotherMadeByAnotherOne() {
    val team1 = testFactoriesService.createTeam1()
    val user1 = testFactoriesService.createUser1(team1)

    val user2 = testFactoriesService.createUser2(team1)

    val (restaurant, dishes) = testFactoriesService.createRestaurantAndDishes(team1)
    val order = testFactoriesService.createOrder(restaurant, user1, team1)
    val orderEntry1 = testFactoriesService.createOrderEntry(order, dishes[0], user1, team1)
    val orderEntry2 = testFactoriesService.createOrderEntry(order, dishes[0], user2, team1)

    orderService.setAsOrdered(order.id, "", user1)


    val order2 = testFactoriesService.createOrder(restaurant, user2, team1)
    val orderEntry3 = testFactoriesService.createOrderEntry(order2, dishes[1], user1, team1)
    val orderEntry4 = testFactoriesService.createOrderEntry(order2, dishes[1], user2, team1)

    orderService.setAsOrdered(order2.id, "", user2)


    val resultUser1 = balanceService.getOrderHistory(user1)
    assertThat(resultUser1.owedMoney).isEqualTo(mapOf(user2.username to dishes[0].price - dishes[1].price))


    val resultUser2 = balanceService.getOrderHistory(user2)
    assertThat(resultUser2.owedMoney).isEqualTo(mapOf(user1.username to dishes[1].price - dishes[0].price))
  }

  @Test()
  fun itShouldReturnProperHistoryEntriesInTwoOrdersAreAlreadyPaid() {
    val team1 = testFactoriesService.createTeam1()
    val user1 = testFactoriesService.createUser1(team1)

    val user2 = testFactoriesService.createUser2(team1)

    val (restaurant, dishes) = testFactoriesService.createRestaurantAndDishes(team1)
    val order = testFactoriesService.createOrder(restaurant, user1, team1)
    val orderEntry1 = testFactoriesService.createOrderEntry(order, dishes[0], user1, team1)
    val orderEntry2 = testFactoriesService.createOrderEntry(order, dishes[0], user2, team1)

    orderService.setAsOrdered(order.id, "", user1)
    orderEntryService.setAsConfirmedAsPaid(orderEntry1.id)
    orderEntryService.setAsConfirmedAsPaid(orderEntry2.id)


    val order2 = testFactoriesService.createOrder(restaurant, user2, team1)
    val orderEntry3 = testFactoriesService.createOrderEntry(order2, dishes[1], user1, team1)
    val orderEntry4 = testFactoriesService.createOrderEntry(order2, dishes[1], user2, team1)

    orderService.setAsOrdered(order2.id, "", user2)
    orderEntryService.setAsConfirmedAsPaid(orderEntry3.id)
    orderEntryService.setAsConfirmedAsPaid(orderEntry4.id)


    val resultUser1 = balanceService.getOrderHistory(user1)
   assertThat(resultUser1.owedMoney).isEqualTo(emptyMap<String, Int>())


    val resultUser2 = balanceService.getOrderHistory(user2)
    assertThat(resultUser2.owedMoney).isEqualTo(emptyMap<String, Int>())
  }

  @Test()
  fun itShouldReturnEmptyListIfCreatedOrderIsInCreatedState() {
    val team1 = testFactoriesService.createTeam1()
    val user = testFactoriesService.createUser1(team1)

    val (restaurant, dishes) = testFactoriesService.createRestaurantAndDishes(team1)
    val order = testFactoriesService.createOrder(restaurant, user, team1)
    val orderEntry = testFactoriesService.createOrderEntry(order, dishes[0], user, team1)

    val result = balanceService.getOrderHistory(user)
    assertThat(result.owedMoney).isEqualTo(emptyMap<String, Int>())
  }

  @Test()
  fun itShouldReturnEmptyListIfCreatedOrderIsInOrderingState() {
    val team1 = testFactoriesService.createTeam1()
    val user = testFactoriesService.createUser1(team1)

    val (restaurant, dishes) = testFactoriesService.createRestaurantAndDishes(team1)
    val order = testFactoriesService.createOrder(restaurant, user, team1)
    val orderEntry = testFactoriesService.createOrderEntry(order, dishes[0], user, team1)

    orderService.setAsOrdering(order.id, user)

    val result = balanceService.getOrderHistory(user)

    assertThat(result.owedMoney).isEqualTo(emptyMap<String, Int>())
  }

  @Test()
  fun itShouldReturnEmptyListIfCreatedOrderIsInRejectedState() {
    val team1 = testFactoriesService.createTeam1()
    val user = testFactoriesService.createUser1(team1)

    val (restaurant, dishes) = testFactoriesService.createRestaurantAndDishes(team1)
    val order = testFactoriesService.createOrder(restaurant, user, team1)
    val orderEntry = testFactoriesService.createOrderEntry(order, dishes[0], user, team1)

    orderService.setAsRejected(order.id, user)

    val result = balanceService.getOrderHistory(user)

    assertThat(result.owedMoney).isEqualTo(emptyMap<String, Int>())
  }

  @Test()
  fun itShouldReturnEmptyListIfParticipatedOrderIsInCreatedState() {
    val team1 = testFactoriesService.createTeam1()
    val user1 = testFactoriesService.createUser1(team1)

    val (restaurant, dishes) = testFactoriesService.createRestaurantAndDishes(team1)
    val order = testFactoriesService.createOrder(restaurant, user1, team1)

    val user2 = testFactoriesService.createUser2(team1)
    val orderEntry = testFactoriesService.createOrderEntry(order, dishes[0], user2, team1)

    val result = balanceService.getOrderHistory(user2)

    assertThat(result.owedMoney).isEqualTo(emptyMap<String, Int>())
  }

  @Test()
  fun itShouldReturnEmptyListIfParticipatedOrderIsInOrderingState() {
    val team1 = testFactoriesService.createTeam1()
    val user1 = testFactoriesService.createUser1(team1)

    val (restaurant, dishes) = testFactoriesService.createRestaurantAndDishes(team1)
    val order = testFactoriesService.createOrder(restaurant, user1, team1)

    val user2 = testFactoriesService.createUser2(team1)
    val orderEntry = testFactoriesService.createOrderEntry(order, dishes[0], user2, team1)

    orderService.setAsOrdering(order.id, user1)

    val result = balanceService.getOrderHistory(user2)

    assertThat(result.owedMoney).isEqualTo(emptyMap<String, Int>())
  }

  @Test()
  fun itShouldReturnEmptyListIfParticipatedOrderIsInRejectedState() {
    val team1 = testFactoriesService.createTeam1()
    val user1 = testFactoriesService.createUser1(team1)

    val (restaurant, dishes) = testFactoriesService.createRestaurantAndDishes(team1)
    val order = testFactoriesService.createOrder(restaurant, user1, team1)

    val user2 = testFactoriesService.createUser2(team1)
    val orderEntry = testFactoriesService.createOrderEntry(order, dishes[0], user2, team1)

    orderService.setAsRejected(order.id, user1)

    val result = balanceService.getOrderHistory(user2)

    assertThat(result.owedMoney).isEqualTo(emptyMap<String, Int>())
  }

}
