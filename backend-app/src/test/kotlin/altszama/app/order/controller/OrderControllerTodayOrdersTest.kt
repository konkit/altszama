package altszama.app.order.controller

import altszama.app.auth.UserService
import altszama.app.order.OrderService
import altszama.app.order.dto.DeliveryData
import altszama.app.order.dto.OrderSaveRequest
import altszama.app.order.dto.PaymentData
import altszama.app.order.dto.TodayOrdersResponse
import altszama.app.restaurant.RestaurantService
import altszama.app.restaurant.dto.RestaurantSaveRequest
import altszama.app.test.AbstractIntegrationTest
import altszama.app.test.TestFactoriesService
import com.fasterxml.jackson.databind.ObjectMapper
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import java.time.LocalDate


open class OrderControllerTodayOrdersTest() : AbstractIntegrationTest() {

  @Autowired
  private lateinit var mockMvc: MockMvc

  @Autowired
  private lateinit var userService: UserService

  @Autowired
  private lateinit var restaurantService: RestaurantService

  @Autowired
  private lateinit var orderService: OrderService

  @Autowired
  private lateinit var objectMapper: ObjectMapper

  @Autowired
  private lateinit var testFactoriesService: TestFactoriesService


  @Test
  fun shouldReturnEmptyOrdersListIfThereAreNoOrders() {
    val team1 = testFactoriesService.createTeam1()
    val (user1Token, user1) = testFactoriesService.createUser1WithToken(team1)

    val request = get("/api/orders/today.json")
        .header("Authorization", user1Token)

    val responseJson = mockMvc.perform(request)
        .andExpect(status().isOk)
        .andReturn()
        .response.contentAsString

    val response = objectMapper.readValue(responseJson, TodayOrdersResponse::class.java)

    assertThat(response.ordersList).isEmpty()
    assertThat(response.currentOrderEntries).isEmpty()
  }

  @Test
  fun shouldReturnOrdersIfThereAreAny() {
    val team1 = testFactoriesService.createTeam1()
    val (user1Token, user1) = testFactoriesService.createUser1WithToken(team1)

    val restaurant = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1"))
    val orderDate = LocalDate.now()
    val orderSaveRequest = OrderSaveRequest(
        restaurant.id,
        orderDate,
        timeOfOrder = null,
        deliveryData = DeliveryData(),
        paymentData = PaymentData()
    )
    orderService.saveOrder(orderSaveRequest, user1, team1)

    val request = get("/api/orders/today.json")
        .header("Authorization", user1Token)

    val responseJson = mockMvc.perform(request)
        .andExpect(status().isOk)
        .andReturn()
        .response.contentAsString

    val response = objectMapper.readValue(responseJson, TodayOrdersResponse::class.java)

    assertThat(response.ordersList).hasSize(1)
    assertThat(response.ordersList[0].restaurantId).isEqualTo(restaurant.id)
    assertThat(response.ordersList[0].restaurantName).isEqualTo(restaurant.name)
    assertThat(response.ordersList[0].orderCreatorId).isEqualTo(user1.id)
    assertThat(response.ordersList[0].orderCreatorUsername).isEqualTo(user1.username)
    assertThat(response.ordersList[0].orderDate).isEqualTo(orderDate)

    assertThat(response.currentOrderEntries).hasSize(0)
  }

  @Test
  fun shouldReturnOnlyOrdersUserHasAccessTo() {
    val team1 = testFactoriesService.createTeam1()
    val (user1Token, user1) = testFactoriesService.createUser1WithToken(team1)

    val restaurant1 = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1"))
    val orderDate1 = LocalDate.now()
    val orderSaveRequest1 = OrderSaveRequest(
        restaurant1.id,
        orderDate1,
        timeOfOrder = null,
        deliveryData = DeliveryData(),
        paymentData = PaymentData()
    )
    orderService.saveOrder(orderSaveRequest1, user1, team1)

    val orderCreator2 = userService.createNewUser("James2", "james@team2.com")
    val team2 = testFactoriesService.createTeam2()

    val restaurant2 = restaurantService.createRestaurant(team2, RestaurantSaveRequest("Restaurant 2"))
    val orderDate2 = LocalDate.now()
    val orderSaveRequest2 = OrderSaveRequest(
        restaurant2.id,
        orderDate2,
        timeOfOrder = null,
        deliveryData = DeliveryData(),
        paymentData = PaymentData()
    )
    orderService.saveOrder(orderSaveRequest2, orderCreator2, team2)

    val request = get("/api/orders/today.json")
        .header("Authorization", user1Token)

    val responseJson = mockMvc.perform(request)
        .andExpect(status().isOk)
        .andReturn()
        .response.contentAsString

    val response = objectMapper.readValue(responseJson, TodayOrdersResponse::class.java)

    assertThat(response.ordersList).hasSize(1)
    assertThat(response.ordersList[0].restaurantId).isEqualTo(restaurant1.id)
    assertThat(response.ordersList[0].restaurantName).isEqualTo(restaurant1.name)
    assertThat(response.ordersList[0].orderCreatorId).isEqualTo(user1.id)
    assertThat(response.ordersList[0].orderCreatorUsername).isEqualTo(user1.username)
    assertThat(response.ordersList[0].orderDate).isEqualTo(orderDate1)

    assertThat(response.currentOrderEntries).hasSize(0)
  }

  @Test
  fun shouldReturnOnlyTodayOrders() {
    val team1 = testFactoriesService.createTeam1()
    val (user1Token, user1) = testFactoriesService.createUser1WithToken(team1)

    val restaurant1 = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1"))
    val restaurant2 = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 2"))

    val todayOrderDate = LocalDate.now()
    val orderSaveRequest1 = OrderSaveRequest(
        restaurant1.id,
        todayOrderDate,
        timeOfOrder = null,
        deliveryData = DeliveryData(),
        paymentData = PaymentData()
    )
    orderService.saveOrder(orderSaveRequest1, user1, team1)

    val ysterdayOrderDate = LocalDate.now().minusDays(1)
    val orderSaveRequest2 = OrderSaveRequest(
        restaurant2.id,
        ysterdayOrderDate,
        timeOfOrder = null,
        deliveryData = DeliveryData(),
        paymentData = PaymentData()
    )
    orderService.saveOrder(orderSaveRequest2, user1, team1)

    val request = get("/api/orders/today.json")
        .header("Authorization", user1Token)

    val responseJson = mockMvc.perform(request)
        .andExpect(status().isOk)
        .andReturn()
        .response.contentAsString

    val response = objectMapper.readValue(responseJson, TodayOrdersResponse::class.java)

    assertThat(response.ordersList).hasSize(1)
    assertThat(response.ordersList[0].restaurantId).isEqualTo(restaurant1.id)
    assertThat(response.ordersList[0].orderDate).isEqualTo(todayOrderDate)

    assertThat(response.currentOrderEntries).hasSize(0)
  }

  @Test
  fun shouldReturnOrdersOnlyFromTheCorrectTeam() {
    val orderDate = LocalDate.now()

    val team1 = testFactoriesService.createTeam1()
    val (user1Token, user1) = testFactoriesService.createUser1WithToken(team1)

    val restaurant1 = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1"))
    val orderSaveRequest1 = OrderSaveRequest(
        restaurant1.id,
        orderDate,
        timeOfOrder = null,
        deliveryData = DeliveryData(),
        paymentData = PaymentData()
    )
    orderService.saveOrder(orderSaveRequest1, user1, team1)

    val orderCreator2 = userService.createNewUser("James", "james@team2.com")
    val team2 = testFactoriesService.createTeam2()

    val restaurant2 = restaurantService.createRestaurant(team2, RestaurantSaveRequest("Restaurant 2"))
    val orderSaveRequest2 = OrderSaveRequest(
        restaurant2.id,
        orderDate,
        timeOfOrder = null,
        deliveryData = DeliveryData(),
        paymentData = PaymentData()
    )
    orderService.saveOrder(orderSaveRequest2, orderCreator2, team2)

    val request = get("/api/orders/today.json")
        .header("Authorization", user1Token)

    val responseJson = mockMvc.perform(request)
        .andExpect(status().isOk)
        .andReturn()
        .response.contentAsString

    val response = objectMapper.readValue(responseJson, TodayOrdersResponse::class.java)

    assertThat(response.ordersList).hasSize(1)
    assertThat(response.ordersList[0].restaurantId).isEqualTo(restaurant1.id)
    assertThat(response.ordersList[0].restaurantName).isEqualTo(restaurant1.name)
    assertThat(response.ordersList[0].orderCreatorId).isEqualTo(user1.id)
    assertThat(response.ordersList[0].orderCreatorUsername).isEqualTo(user1.username)
    assertThat(response.ordersList[0].orderDate).isEqualTo(orderDate)

    assertThat(response.currentOrderEntries).hasSize(0)
  }
}
