package altszama.app.balance

import altszama.app.order.OrderService
import altszama.app.order.dto.DeliveryData
import altszama.app.orderEntry.OrderEntryService
import altszama.app.test.AbstractIntegrationTest
import altszama.app.test.TestFactoriesService
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired

class BalanceServiceTest : AbstractIntegrationTest()  {
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
  fun emptyEntriesShouldResultInEmptyList() {
    val team1 = testFactoriesService.createTeam1()
    val user = testFactoriesService.createUser1(team1)

    val orderHistory = balanceService.getOrderHistory(user)

    assertThat(orderHistory.entries).isEmpty()
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

  @Test()
  fun testIfCalculatesFine() {
    val team1 = testFactoriesService.createTeam1()

    val user1 = testFactoriesService.createUser1(team1)
    val user2 = testFactoriesService.createUser2(team1)
    val user3 = testFactoriesService.createUser3(team1)

    val (restaurant, dishes) = testFactoriesService.createRestaurantAndDishes(team1)
    val dish1 = testFactoriesService.createDish(restaurant, "Custom Dish 1", 2799, team1)

    val order = testFactoriesService.createOrder(restaurant, user1, team1, deliveryData = DeliveryData(decreaseInPercent = 10))

    val orderEntry1 = testFactoriesService.createOrderEntry(order, dish1, user1, team1)
    val orderEntry2 = testFactoriesService.createOrderEntry(order, dish1, user2, team1)
    val orderEntry3 = testFactoriesService.createOrderEntry(order, dish1, user3, team1)

    orderService.setAsOrdered(order.id, "", user1)

    orderEntryService.setAsConfirmedAsPaid(orderEntry1.id)
    orderEntryService.setAsConfirmedAsPaid(orderEntry2.id)
    orderEntryService.setAsConfirmedAsPaid(orderEntry3.id)

    val result = balanceService.getOrderHistory(user1)

    val entry = result.entries[0] as OrderHistoryCreatedEntry
    assertThat(entry.totalAmount).isEqualTo(7560)
    assertThat(entry.confirmedPaymentsTotalAmount).isEqualTo(7560)
  }


}
