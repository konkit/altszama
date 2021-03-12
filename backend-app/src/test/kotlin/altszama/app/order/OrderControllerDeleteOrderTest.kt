package altszama.app.order

import altszama.app.auth.UserService
import altszama.app.dish.DishService
import altszama.app.dish.dto.DishCreateRequest
import altszama.app.order.dto.DeliveryData
import altszama.app.order.dto.OrderSaveRequest
import altszama.app.order.dto.PaymentData
import altszama.app.orderEntry.OrderEntryRepository
import altszama.app.orderEntry.OrderEntryService
import altszama.app.orderEntry.dto.OrderEntrySaveRequest
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
import java.time.format.DateTimeFormatter

class OrderControllerDeleteOrderTest() : AbstractIntegrationTest() {

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
  private lateinit var orderEntryRepository: OrderEntryRepository

  @Autowired
  private lateinit var orderEntryService: OrderEntryService

  @Autowired
  private lateinit var orderControllerDataService: OrderControllerDataService

  @Autowired
  private lateinit var objectMapper: ObjectMapper


  @Test
  fun itShouldDeleteOrderSuccessfully() {
    val team1 = teamService.createTeam("team1.com", "team1.com")
    val (user1Token, user1) = createUserAndGetToken("James1", "james1@team1.com")

    val restaurant = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1"))
    val dish1 = dishService.saveDish(team1, restaurant.id, DishCreateRequest("Dish 1", 100, category = "Category 1"))

    val orderSaveRequest = OrderSaveRequest(restaurantId = restaurant.id, orderDate = LocalDate.now(), timeOfOrder = LocalTime.of(14, 0), deliveryData = DeliveryData(), paymentData = PaymentData())
    val order = orderService.saveOrder(orderSaveRequest, currentUser = user1, currentUserTeam = team1)

    val orderEntrySaveRequest = OrderEntrySaveRequest(orderId = order.id, dishId = dish1.id, newDish = false, newDishName = null, newDishPrice = null)
    val orderEntry = orderEntryService.saveEntry(user1, orderEntrySaveRequest)

    val request = MockMvcRequestBuilders.delete("/api/orders/${order.id}/delete")
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user1Token)

    mockMvc.perform(request)
        .andExpect(MockMvcResultMatchers.status().isOk)

    assertThat(orderRepository.findById(order.id)).isEmpty
    assertThat(orderEntryRepository.findById(orderEntry.id)).isEmpty
  }

  @Test
  fun itShouldNotDeleteOrderIfItDoesNotExist() {
    val team1 = teamService.createTeam("team1.com", "team1.com")
    val (user1Token, user1) = createUserAndGetToken("James1", "james1@team1.com")

    val restaurant = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1"))
    val dish1 = dishService.saveDish(team1, restaurant.id, DishCreateRequest("Dish 1", 100, category = "Category 1"))

    val fakeOrderId = "111111111"

    val request = MockMvcRequestBuilders.delete("/api/orders/${fakeOrderId}/delete")
      .contentType(MediaType.APPLICATION_JSON)
      .header("Authorization", user1Token)

    expectBadRequestWithMessage(request, "Order does not exist")
  }

  @Test
  fun itShouldNotUpdateOrderIfItIsNotCreator() {
    val team1 = teamService.createTeam("team1.com", "team1.com")
    val (token, user1) = createUserAndGetToken("james1@team1.com", "James1")

    val restaurant = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1"))
    val dish1 = dishService.saveDish(team1, restaurant.id, DishCreateRequest("Dish 1", 100, category = "Category 1"))

    val orderSaveRequest = OrderSaveRequest(restaurantId = restaurant.id, orderDate = LocalDate.now(), timeOfOrder = LocalTime.of(14, 0), deliveryData = DeliveryData(), paymentData = PaymentData())
    val order = orderService.saveOrder(orderSaveRequest, currentUser = user1, currentUserTeam = team1)

    val (user2Token, user2) = createUserAndGetToken("James2", "james2@team1.com")

    val nowDate = LocalDate.now()
    val updateContent = """{
        "orderId": "${order.id}",
        "restaurantId": "${restaurant.id}",
        "orderDate": "${nowDate.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"))}",
        "deliveryData": {},
        "paymentData": {
          "paymentByCash": false,
          "paymentByBankTransfer": false,
          "bankTransferNumber": "",
          "paymentByBlik": false,
          "blikPhoneNumber": ""
        }
    }""".trimIndent()

    val request = MockMvcRequestBuilders.delete("/api/orders/${order.id}/delete")
      .contentType(MediaType.APPLICATION_JSON)
      .header("Authorization", user2Token)

    expectBadRequestWithMessage(request, "You can edit only your own orders")
  }

}
