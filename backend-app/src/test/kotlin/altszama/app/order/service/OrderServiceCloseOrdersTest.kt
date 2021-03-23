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
import altszama.app.team.TeamService
import altszama.app.test.AbstractIntegrationTest
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
  private lateinit var teamService: TeamService

  @Autowired
  private lateinit var restaurantService: RestaurantService

  @Autowired
  private lateinit var dishService: DishService

  @Test
  fun itShouldMarkEmptyOrderAsRejectedIfItJustInCreatedState() {
    val team1 = teamService.createTeam("team1.com", "team1.com")
    val (user1Token, user1) = createUserAndGetToken("James1", "james1@team1.com")

    val order = createOrderInThePast(user1, team1)

    orderService.closePastOrders()

    val updatedOrder = orderRepository.findById(order.id).get()

    assertThat(updatedOrder.orderState).isEqualTo(OrderState.REJECTED)
  }

  @Test
  fun itShouldMarkEmptyOrderAsRejectedIfItJustInOrderingState() {
    val team1 = teamService.createTeam("team1.com", "team1.com")
    val (user1Token, user1) = createUserAndGetToken("James1", "james1@team1.com")

    val order = createOrderInThePast(user1, team1)

    orderService.setAsOrdering(order.id, user1)

    orderService.closePastOrders()

    val updatedOrder = orderRepository.findById(order.id).get()

    assertThat(updatedOrder.orderState).isEqualTo(OrderState.REJECTED)
  }

  @Test
  fun itShouldMarkEmptyOrderAsDeliveredIfItWasOrdered() {
    val team1 = teamService.createTeam("team1.com", "team1.com")
    val (user1Token, user1) = createUserAndGetToken("James1", "james1@team1.com")

    val order = createOrderInThePast(user1, team1)

    orderService.setAsOrdered(order.id, "", user1)

    orderService.closePastOrders()

    val updatedOrder = orderRepository.findById(order.id).get()

    assertThat(updatedOrder.orderState).isEqualTo(OrderState.DELIVERED)
  }

  @Test
  fun itShouldNotChangeOrderIfItWasDelivered() {
    val team1 = teamService.createTeam("team1.com", "team1.com")
    val (user1Token, user1) = createUserAndGetToken("James1", "james1@team1.com")

    val order = createOrderInThePast(user1, team1)

    orderService.setAsDelivered(order.id, user1)

    orderService.closePastOrders()

    val updatedOrder = orderRepository.findById(order.id).get()

    assertThat(updatedOrder.orderState).isEqualTo(OrderState.DELIVERED)
  }

  private fun createOrderInThePast(user1: User,team1: Team): Order {
    val restaurant = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1"))
    val dish1 = dishService.saveDish(team1, restaurant.id, DishCreateRequest("Dish 1", 100, category = "Category 1"))

    val orderSaveRequest = OrderSaveRequest(
      restaurantId = restaurant.id,
      orderDate = LocalDate.now().minusDays(1),
      timeOfOrder = LocalTime.of(14, 0),
      deliveryData = DeliveryData(),
      paymentData = PaymentData()
    )
    val order = orderService.saveOrder(orderSaveRequest, currentUser = user1, currentUserTeam = team1)
    createOrderEntry(order, dish1, user1, team1)

    return order
  }

}