package altszama.app.balance

import altszama.app.auth.UserService
import altszama.app.order.OrderService
import altszama.app.orderEntry.OrderEntryService
import altszama.app.test.AbstractIntegrationTest
import altszama.app.test.TestFactoriesService
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import java.time.LocalDate

class BalanceServiceOwedMoneyTest : AbstractIntegrationTest() {
  @Autowired
  private lateinit var balanceService: BalanceService

  @Autowired
  private lateinit var orderService: OrderService

  @Autowired
  private lateinit var orderEntryService: OrderEntryService

  @Autowired
  private lateinit var testFactoriesService: TestFactoriesService

  @Autowired
  private lateinit var userService: UserService

  @Test()
  fun owedMoneyByUserShouldKeepPeopleWithTheSameNameApart() {
    val team1 = testFactoriesService.createTeam1()
    val user1 = testFactoriesService.createUser1(team1)
    val user2 = testFactoriesService.createUser2(team1)
    val user2Namesake = userService.createNewUser(user2.username, "james.other@${team1.domain}")

    val (restaurant, dishes) = testFactoriesService.createRestaurantAndDishes(team1)
    val order = testFactoriesService.createOrder(restaurant, user1, team1)
    testFactoriesService.createOrderEntry(order, dishes[0], user1, team1)
    testFactoriesService.createOrderEntry(order, dishes[0], user2, team1)
    testFactoriesService.createOrderEntry(order, dishes[1], user2Namesake, team1)
    orderService.setAsOrdered(order.id, "", user1)

    val orderHistory = balanceService.getOrderHistory(user1)

    assertThat(orderHistory.owedMoneyByUser).containsExactlyInAnyOrder(
      OwedMoneyEntry(user2.id, user2.username, dishes[0].price),
      OwedMoneyEntry(user2Namesake.id, user2Namesake.username, dishes[1].price),
    )
    // The username-keyed map for older clients sums people with the same name
    assertThat(orderHistory.owedMoney).isEqualTo(mapOf(user2.username to dishes[0].price + dishes[1].price))
  }

  @Test()
  fun orderOwnerShouldNotOweMoneyToThemselves() {
    val team1 = testFactoriesService.createTeam1()
    val user1 = testFactoriesService.createUser1(team1)
    val user2 = testFactoriesService.createUser2(team1)

    val (restaurant, dishes) = testFactoriesService.createRestaurantAndDishes(team1)
    val order = testFactoriesService.createOrder(restaurant, user1, team1)
    val ownerEntry = testFactoriesService.createOrderEntry(order, dishes[0], user1, team1)
    testFactoriesService.createOrderEntry(order, dishes[1], user2, team1)
    orderService.setAsOrdered(order.id, "", user1)
    orderEntryService.setAsUnpaid(ownerEntry.id)

    val orderHistory = balanceService.getOrderHistory(user1)

    assertThat(orderHistory.owedMoneyByUser).containsExactly(OwedMoneyEntry(user2.id, user2.username, dishes[1].price))
    assertThat(orderHistory.owedMoney).isEqualTo(mapOf(user2.username to dishes[1].price))
  }

  @Test()
  fun owedMoneyShouldBeCorrectForSingleOrderedOrder() {
    val team1 = testFactoriesService.createTeam1()
    val user1 = testFactoriesService.createUser1(team1)
    val user2 = testFactoriesService.createUser2(team1)

    val (restaurant, dishes) = testFactoriesService.createRestaurantAndDishes(team1)
    val order = testFactoriesService.createOrder(restaurant, user1, team1)
    val orderEntry1 = testFactoriesService.createOrderEntry(order, dishes[0], user1, team1)
    val orderEntry2 = testFactoriesService.createOrderEntry(order, dishes[0], user2, team1)
    orderService.setAsOrdered(order.id, "", user1)

    val orderHistory1 = balanceService.getOrderHistory(user1)
    assertThat(orderHistory1.owedMoney).isEqualTo(mapOf(user2.username to dishes[0].price))
    val orderHistory2 = balanceService.getOrderHistory(user2)
    assertThat(orderHistory2.owedMoney).isEqualTo(mapOf(user1.username to -dishes[0].price))
  }

  @Test()
  fun owedMoneyShouldBeCorrectForTwoOrdersMadeByTwoUsers() {
    val team1 = testFactoriesService.createTeam1()
    val user1 = testFactoriesService.createUser1(team1)
    val user2 = testFactoriesService.createUser2(team1)
    val (restaurant, dishes) = testFactoriesService.createRestaurantAndDishes(team1)

    val order1 = testFactoriesService.createOrder(restaurant, user1, team1)
    val orderEntry1 = testFactoriesService.createOrderEntry(order1, dishes[0], user1, team1)
    val orderEntry2 = testFactoriesService.createOrderEntry(order1, dishes[0], user2, team1)
    orderService.setAsOrdered(order1.id, "", user1)

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
  fun owedMoneyShouldBeCorrectForMoreOrdersMadeBySingleUser() {
    val team1 = testFactoriesService.createTeam1()
    val user1 = testFactoriesService.createUser1(team1)
    val user2 = testFactoriesService.createUser2(team1)
    val (restaurant, dishes) = testFactoriesService.createRestaurantAndDishes(team1)

    val numOfOrders = 5
    for (i in 1..numOfOrders) {
      val orderDate = LocalDate.now().minusDays(i.toLong())
      val order1 = testFactoriesService.createOrder(restaurant, user1, team1, orderDate = orderDate)
      val orderEntry1 = testFactoriesService.createOrderEntry(order1, dishes[0], user1, team1)
      val orderEntry2 = testFactoriesService.createOrderEntry(order1, dishes[1], user2, team1)
      orderService.setAsOrdered(order1.id, "", user1)
    }

    val resultUser1 = balanceService.getOrderHistory(user1)
    assertThat(resultUser1.owedMoney).isEqualTo(mapOf(user2.username to dishes[1].price * numOfOrders))
    val resultUser2 = balanceService.getOrderHistory(user2)
    assertThat(resultUser2.owedMoney).isEqualTo(mapOf(user1.username to -dishes[1].price * numOfOrders))
  }

  @Test()
  fun owedMoneyShouldBeCorrectForTwoAlreadyPaidOrders() {
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
}
