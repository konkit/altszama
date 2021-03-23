package altszama.app.order.controller

import altszama.app.auth.UserService
import altszama.app.dish.DishService
import altszama.app.dish.dto.DishCreateRequest
import altszama.app.order.OrderControllerDataService
import altszama.app.order.OrderRepository
import altszama.app.order.OrderService
import altszama.app.order.OrderState
import altszama.app.order.dto.DeliveryData
import altszama.app.order.dto.OrderSaveRequest
import altszama.app.order.dto.PaymentData
import altszama.app.orderEntry.OrderEntryService
import altszama.app.restaurant.RestaurantService
import altszama.app.restaurant.dto.RestaurantSaveRequest
import altszama.app.team.TeamService
import altszama.app.test.AbstractIntegrationTest
import com.fasterxml.jackson.databind.ObjectMapper
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import java.time.LocalDate
import java.time.LocalTime

class OrderControllerSetBackAsOrdered() : AbstractIntegrationTest() {

  @Autowired
  private lateinit var mockMvc: MockMvc

  @Autowired
  private lateinit var userService: UserService

  @Autowired
  private lateinit var teamService: TeamService

  @Autowired
  private lateinit var restaurantService: RestaurantService

  @Autowired
  private lateinit var dishService: DishService

  @Autowired
  private lateinit var orderService: OrderService

  @Autowired
  private lateinit var orderEntryService: OrderEntryService

  @Autowired
  private lateinit var orderControllerDataService: OrderControllerDataService

  @Autowired
  private lateinit var objectMapper: ObjectMapper

  @Autowired
  private lateinit var orderRepository: OrderRepository


  @Test
  fun shouldSetBackAsOrderedSuccessfully() {
    val team1 = teamService.createTeam("team1.com", "", userEmails = listOf("john@mail.com"))
    val (token, user1) = createUserAndGetToken("John", "john@mail.com")

    val restaurant = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1"))
    val dish1 = dishService.saveDish(team1, restaurant.id, DishCreateRequest("Dish 1", 100, category = "Category 1"))

    val orderSaveRequest = OrderSaveRequest(
      restaurantId = restaurant.id,
      orderDate = LocalDate.now(),
      timeOfOrder = LocalTime.of(14, 0),
      deliveryData = DeliveryData(),
      paymentData = PaymentData()
    )
    val order = orderService.saveOrder(orderSaveRequest, currentUser = user1, currentUserTeam = team1)
    createOrderEntry(order, dish1, user1, team1)

    orderService.setAsOrdered(order.id, "14:00", user1)
    orderService.setAsDelivered(order.id, user1)

    val request = MockMvcRequestBuilders.put("/api/orders/${order.id}/set_back_as_ordered")
      .contentType(MediaType.APPLICATION_JSON)
      .header("Authorization", token)

    mockMvc.perform(request)
      .andExpect(MockMvcResultMatchers.status().isOk)

    val afterSetAsCreated = orderRepository.findById(order.id).get()
    assertThat(afterSetAsCreated.orderState).isEqualTo(OrderState.ORDERED)
  }

  @Test
  fun shouldNotSetAsOrderedIfTheOrderDoesNotExist() {
    val team1 = teamService.createTeam("team1.com", "", userEmails = listOf("john@mail.com"))
    val (token, user1) = createUserAndGetToken("John", "john@mail.com")

    val request = MockMvcRequestBuilders.put("/api/orders/${fakeOrderId}/set_back_as_ordered")
      .contentType(MediaType.APPLICATION_JSON)
      .header("Authorization", token)

    expectBadRequestWithMessage(request, "Order does not exist")
  }

  @Test
  fun shouldNotSetAsOrderedIfTheOrderWasNotCreatedByUser() {
    val team1 = teamService.createTeam("team1.com", "", userEmails = listOf("john@mail.com"))
    val (token, user1) = createUserAndGetToken("John", "john@mail.com")

    val restaurant = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1"))
    val dish1 = dishService.saveDish(team1, restaurant.id, DishCreateRequest("Dish 1", 100, category = "Category 1"))

    val orderSaveRequest = OrderSaveRequest(
      restaurantId = restaurant.id,
      orderDate = LocalDate.now(),
      timeOfOrder = LocalTime.of(14, 0),
      deliveryData = DeliveryData(),
      paymentData = PaymentData()
    )
    val order = orderService.saveOrder(orderSaveRequest, currentUser = user1, currentUserTeam = team1)
    createOrderEntry(order, dish1, user1, team1)

    orderService.setAsOrdered(order.id, "14:00", user1)
    orderService.setAsDelivered(order.id, user1)

    val (token2, user2) = createUserAndGetToken("James", "james@mail.com")

    val request = MockMvcRequestBuilders.put("/api/orders/${order.id}/set_back_as_ordered")
      .contentType(MediaType.APPLICATION_JSON)
      .header("Authorization", token2)

    expectBadRequestWithMessage(request, "You can edit only your own orders")
  }

}