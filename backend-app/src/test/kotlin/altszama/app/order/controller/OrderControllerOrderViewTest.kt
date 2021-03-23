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
import altszama.app.order.dto.OrderViewInitialData
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
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import java.time.LocalDate

class OrderControllerOrderViewTest () : AbstractIntegrationTest() {

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
  private lateinit var orderRepository: OrderRepository

  @Autowired
  private lateinit var orderEntryService: OrderEntryService

  @Autowired
  private lateinit var orderControllerDataService: OrderControllerDataService

  @Autowired
  private lateinit var objectMapper: ObjectMapper


  @Test()
  fun itShouldMoveToOrderingStateAndReturnOrderViewDataSuccessfully() {
    val team1 = teamService.createTeam("team1.com", "team1.com")
    val (token, orderCreator) = createUserAndGetToken("John", "john@team1.com")

    val restaurant = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1"))

    val dish1 = dishService.saveDish(team1, restaurant.id, DishCreateRequest("Dish 1", 100, category = "Category 1"))

    val orderDate = LocalDate.now()
    val orderSaveRequest = OrderSaveRequest(
        restaurant.id,
        orderDate,
        timeOfOrder = null,
        deliveryData = DeliveryData(),
        paymentData = PaymentData()
    )
    val order = orderService.saveOrder(orderSaveRequest, orderCreator, team1)
    createOrderEntry(order, dish1, orderCreator, team1)

    assertThat(order.orderState).isEqualTo(OrderState.CREATED)


    val request = MockMvcRequestBuilders.get("/api/orders/${order.id}/order_view.json")
        .header("Authorization", token)

    val responseJson = mockMvc.perform(request)
        .andExpect(MockMvcResultMatchers.status().isOk)
        .andReturn()
        .response.contentAsString

    val orderFromDb = orderRepository.findById(order.id).get()
    assertThat(orderFromDb.orderState).isEqualTo(OrderState.ORDERING)


    val response = objectMapper.readValue(responseJson, OrderViewInitialData::class.java)

    assertThat(response.allEatingPeopleCount).isEqualTo(1)
    assertThat(response.basePriceSum).isEqualTo(dish1.price)
    assertThat(response.totalPrice).isEqualTo(dish1.price)
  }

  @Test()
  fun itShouldNotReturnOrderViewIfOrderDoesNotExist() {
    val team1 = teamService.createTeam("team1.com", "team1.com")
    val (token, orderCreator) = createUserAndGetToken("John", "john@team1.com")

    val restaurant = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1"))

    val dish1 = dishService.saveDish(team1, restaurant.id, DishCreateRequest("Dish 1", 100, category = "Category 1"))

    val request = MockMvcRequestBuilders.get("/api/orders/${fakeOrderId}/order_view.json")
        .header("Authorization", token)

    expectBadRequestWithMessage(request, "Order does not exist")
  }

  @Test()
  fun itShouldNotReturnOrderViewIfUserIsNotOrderCreator() {
    val team1 = teamService.createTeam("team1.com", "team1.com")
    val orderCreator = userService.createNewUser("John", "john@team1.com")

    val restaurant = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1"))
    val dish1 = dishService.saveDish(team1, restaurant.id, DishCreateRequest("Dish 1", 100, category = "Category 1"))

    val orderDate = LocalDate.now()
    val orderSaveRequest = OrderSaveRequest(
        restaurant.id,
        orderDate,
        timeOfOrder = null,
        deliveryData = DeliveryData(),
        paymentData = PaymentData()
    )
    val order = orderService.saveOrder(orderSaveRequest, orderCreator, team1)
    createOrderEntry(order, dish1, orderCreator, team1)

    val team2 = teamService.createTeam("team2.com", "team2.com")
    val (token2, user2) = createUserAndGetToken("Jake", "john@team2.com")

    val request = MockMvcRequestBuilders.get("/api/orders/${order.id}/order_view.json")
        .header("Authorization", token2)

    expectBadRequestWithMessage(request, "You can edit only your own orders")
  }

  @Test()
  fun itShouldNotReturnOrderViewIfThereAreNoOrderEntries() {
    val team1 = teamService.createTeam("team1.com", "team1.com")
    val (token, orderCreator) = createUserAndGetToken("John", "john@team1.com")

    val restaurant = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1"))

    val dish1 = dishService.saveDish(team1, restaurant.id, DishCreateRequest("Dish 1", 100, category = "Category 1"))

    val orderDate = LocalDate.now()
    val orderSaveRequest = OrderSaveRequest(
      restaurant.id,
      orderDate,
      timeOfOrder = null,
      deliveryData = DeliveryData(),
      paymentData = PaymentData()
    )
    val order = orderService.saveOrder(orderSaveRequest, orderCreator, team1)

    assertThat(order.orderState).isEqualTo(OrderState.CREATED)

    val request = MockMvcRequestBuilders.get("/api/orders/${order.id}/order_view.json")
      .header("Authorization", token)

    expectBadRequestWithMessage(request, "There are no order entries in this order")
  }

}
