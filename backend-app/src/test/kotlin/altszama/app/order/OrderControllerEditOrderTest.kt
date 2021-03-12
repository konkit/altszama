package altszama.app.order

import altszama.app.auth.UserService
import altszama.app.dish.DishService
import altszama.app.dish.dto.DishCreateRequest
import altszama.app.order.dto.DeliveryData
import altszama.app.order.dto.EditOrderInitialData
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

class OrderControllerEditOrderTest() : AbstractIntegrationTest() {

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


  @Test
  fun itShouldReturnEditDataSuccessfully() {
    val (user1Token, user1) = createUserAndGetToken("James1", "james1@team1.com")
    val team1 = teamService.createTeam("team1.com", "team1.com")

    val restaurant = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1"))
    val dish1 = dishService.saveDish(team1, restaurant.id, DishCreateRequest("Dish 1", 100, category = "Category 1"))

    val orderSaveRequest = OrderSaveRequest(restaurantId = restaurant.id, orderDate = LocalDate.now(), timeOfOrder = LocalTime.of(14, 0), deliveryData = DeliveryData(), paymentData = PaymentData())
    val order = orderService.saveOrder(orderSaveRequest, currentUser = user1, currentUserTeam = team1)
    createOrderEntry(order, dish1, user1, team1)

    val request = MockMvcRequestBuilders.get("/api/orders/${order.id}/edit.json")
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user1Token)

    val responseJson = mockMvc.perform(request)
        .andExpect(MockMvcResultMatchers.status().isOk)
        .andReturn()
        .response.contentAsString

    val response = objectMapper.readValue(responseJson, EditOrderInitialData::class.java)

    assertThat(response.order.id).isEqualTo(order.id)
    assertThat(response.order.orderCreatorUsername).isEqualTo("James1")
    assertThat(response.order.restaurantName).isEqualTo("Restaurant 1")
  }

  @Test
  fun itShouldNotReturnEditDataIfOrderDoesNotExist() {
    val team1 = teamService.createTeam("team1.com", "team1.com")
    val (user1Token, user1) = createUserAndGetToken("James1", "james1@team1.com")

    val restaurant = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1"))
    val dish1 = dishService.saveDish(team1, restaurant.id, DishCreateRequest("Dish 1", 100, category = "Category 1"))

    val fakeOrderId = "111111111"

    val request = MockMvcRequestBuilders.get("/api/orders/${fakeOrderId}/edit.json")
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user1Token)

    expectBadRequestWithMessage(request, "Order does not exist")
  }

  @Test
  fun itShouldNotReturnEditDataIfItIsNotCreator() {
    val user1 = userService.createNewUser("james1@team1.com", "James1")
    val team1 = teamService.createTeam("team1.com", "team1.com")

    val restaurant = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1"))
    val dish1 = dishService.saveDish(team1, restaurant.id, DishCreateRequest("Dish 1", 100, category = "Category 1"))

    val orderSaveRequest = OrderSaveRequest(restaurantId = restaurant.id, orderDate = LocalDate.now(), timeOfOrder = LocalTime.of(14, 0), deliveryData = DeliveryData(), paymentData = PaymentData())
    val order = orderService.saveOrder(orderSaveRequest, currentUser = user1, currentUserTeam = team1)

    val (user2Token, user) = createUserAndGetToken("James2", "james2@team1.com")

    val request = MockMvcRequestBuilders.get("/api/orders/${order.id}/edit.json")
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user2Token)

    expectBadRequestWithMessage(request, "You can edit only your own orders")
  }
}
