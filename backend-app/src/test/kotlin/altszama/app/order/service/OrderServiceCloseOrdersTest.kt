package altszama.app.order.service

import altszama.app.auth.User
import altszama.app.dish.DishService
import altszama.app.dish.dto.DishCreateRequest
import altszama.app.order.Order
import altszama.app.order.OrderRepository
import altszama.app.order.OrderService
import altszama.app.order.OrderState
import altszama.app.order.dto.DeliveryData
import altszama.app.order.dto.OrderSaveRequest
import altszama.app.order.dto.PaymentData
import altszama.app.restaurant.RestaurantService
import altszama.app.restaurant.dto.RestaurantSaveRequest
import altszama.app.team.Team
import altszama.app.test.AbstractIntegrationTest
import altszama.app.test.TestFactoriesService
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import java.time.LocalDate
import java.time.LocalTime

class OrderServiceCloseOrdersTest : AbstractIntegrationTest() {

  @Autowired
  private lateinit var orderService: OrderService

  @Autowired
  private lateinit var orderRepository: OrderRepository

  @Autowired
  private lateinit var restaurantService: RestaurantService

  @Autowired
  private lateinit var dishService: DishService

  @Autowired
  private lateinit var testFactoriesService: TestFactoriesService

  @Test
  fun itShouldMarkEmptyOrderAsRejected() {
    val team1 = testFactoriesService.createTeam1()
    val (user1Token, user1) = testFactoriesService.createUser1WithToken(team1)

    val restaurant = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1"))
    val dish1 = dishService.saveDish(team1, restaurant.id, DishCreateRequest("Dish 1", 100, category = "Category 1"))
    val order = createOrderInThePast(user1, team1, restaurant.id)

    orderService.closePastOrders()

    val updatedOrder = orderRepository.findById(order.id).get()

    assertThat(updatedOrder.orderState).isEqualTo(OrderState.REJECTED)
  }

  @Test
  fun itShouldMarkOrderAsDeliveredIfSomeOrderEntriesWereCreated() {
    val team1 = testFactoriesService.createTeam1()
    val (user1Token, user1) = testFactoriesService.createUser1WithToken(team1)

    val restaurant = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1"))
    val dish1 = dishService.saveDish(team1, restaurant.id, DishCreateRequest("Dish 1", 100, category = "Category 1"))
    val order = createOrderInThePast(user1, team1, restaurant.id)
    testFactoriesService.createOrderEntry(order, dish1, user1, team1)

    orderService.closePastOrders()

    val updatedOrder = orderRepository.findById(order.id).get()

    assertThat(updatedOrder.orderState).isEqualTo(OrderState.DELIVERED)
  }

  @Test
  fun itShouldMarkOrderAsDeliveredIfInOrderingStateAndSomeOrderEntriesWereCreated() {
    val team1 = testFactoriesService.createTeam1()
    val (user1Token, user1) = testFactoriesService.createUser1WithToken(team1)

    val restaurant = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1"))
    val dish1 = dishService.saveDish(team1, restaurant.id, DishCreateRequest("Dish 1", 100, category = "Category 1"))
    val order = createOrderInThePast(user1, team1, restaurant.id)
    testFactoriesService.createOrderEntry(order, dish1, user1, team1)
    orderService.setAsOrdering(order.id, user1)

    orderService.closePastOrders()

    val updatedOrder = orderRepository.findById(order.id).get()

    assertThat(updatedOrder.orderState).isEqualTo(OrderState.DELIVERED)
  }

  @Test
  fun itShouldMarkOrderAsDeliveredIfInOrderedStateAndSomeOrderEntriesWereCreated() {
    val team1 = testFactoriesService.createTeam1()
    val (user1Token, user1) = testFactoriesService.createUser1WithToken(team1)

    val restaurant = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1"))
    val dish1 = dishService.saveDish(team1, restaurant.id, DishCreateRequest("Dish 1", 100, category = "Category 1"))
    val order = createOrderInThePast(user1, team1, restaurant.id)
    testFactoriesService.createOrderEntry(order, dish1, user1, team1)
    orderService.setAsOrdered(order.id, "14:00", user1)

    orderService.closePastOrders()

    val updatedOrder = orderRepository.findById(order.id).get()

    assertThat(updatedOrder.orderState).isEqualTo(OrderState.DELIVERED)
  }

  @Test
  fun itShouldNotChangeOrderIfItWasDelivered() {
    val team1 = testFactoriesService.createTeam1()
    val (user1Token, user1) = testFactoriesService.createUser1WithToken(team1)

    val restaurant = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1"))
    val dish1 = dishService.saveDish(team1, restaurant.id, DishCreateRequest("Dish 1", 100, category = "Category 1"))
    val order = createOrderInThePast(user1, team1, restaurant.id)
    testFactoriesService.createOrderEntry(order, dish1, user1, team1)

    orderService.setAsDelivered(order.id, user1)

    orderService.closePastOrders()

    val updatedOrder = orderRepository.findById(order.id).get()

    assertThat(updatedOrder.orderState).isEqualTo(OrderState.DELIVERED)
  }

  @Test
  fun itShouldNotChangeOrderIfItWasRejected() {
    val team1 = testFactoriesService.createTeam1()
    val (user1Token, user1) = testFactoriesService.createUser1WithToken(team1)

    val restaurant = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1"))
    val dish1 = dishService.saveDish(team1, restaurant.id, DishCreateRequest("Dish 1", 100, category = "Category 1"))
    val order = createOrderInThePast(user1, team1, restaurant.id)
    testFactoriesService.createOrderEntry(order, dish1, user1, team1)

    orderService.setAsRejected(order.id, user1)

    orderService.closePastOrders()

    val updatedOrder = orderRepository.findById(order.id).get()

    assertThat(updatedOrder.orderState).isEqualTo(OrderState.REJECTED)
  }

  private fun createOrderInThePast(user1: User,team1: Team, restaurantId: String): Order {
    val orderSaveRequest = OrderSaveRequest(
      restaurantId = restaurantId,
      orderDate = LocalDate.now().minusDays(1),
      timeOfOrder = LocalTime.of(14, 0),
      deliveryData = DeliveryData(),
      paymentData = PaymentData()
    )
    val order = orderService.saveOrder(orderSaveRequest, currentUser = user1, currentUserTeam = team1)
    return order
  }

}
