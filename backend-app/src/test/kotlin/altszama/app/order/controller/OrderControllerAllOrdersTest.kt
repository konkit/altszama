package altszama.app.order.controller

import altszama.app.order.OrderService
import altszama.app.order.dto.AllOrdersResponse
import altszama.app.order.dto.DeliveryData
import altszama.app.order.dto.OrderSaveRequest
import altszama.app.order.dto.PaymentData
import altszama.app.restaurant.RestaurantService
import altszama.app.restaurant.dto.RestaurantSaveRequest
import altszama.app.test.AbstractIntegrationTest
import altszama.app.test.TestFactoriesService
import com.fasterxml.jackson.databind.ObjectMapper
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import java.time.LocalDate

open class OrderControllerAllOrdersTest() : AbstractIntegrationTest() {

  @Autowired
  private lateinit var mockMvc: MockMvc

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
    val (user1Token, user) = testFactoriesService.createUser1WithToken(team1)

    val request = MockMvcRequestBuilders.get("/api/orders/all.json")
        .header("Authorization", user1Token)

    val responseJson = mockMvc.perform(request)
        .andExpect(MockMvcResultMatchers.status().isOk)
        .andReturn()
        .response.contentAsString

    val response = objectMapper.readValue(responseJson, AllOrdersResponse::class.java)

    assertThat(response.allOrdersList).hasSize(0)
  }

  @Test
  fun shouldReturnOrdersIfThereAreAny() {
    val team1 = testFactoriesService.createTeam1()
    val orderCreator = testFactoriesService.createUser1(team1)

    val restaurant = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1"))
    val orderDate = LocalDate.now()
    val orderSaveRequest = OrderSaveRequest(
        restaurant.id,
        orderDate,
        timeOfOrder = null,
        deliveryData = DeliveryData(),
        paymentData = PaymentData()
    )
    orderService.saveOrder(orderSaveRequest, orderCreator, team1)

    val (user2Token, user) = testFactoriesService.createUser2WithToken(team1)

    val request = MockMvcRequestBuilders.get("/api/orders/all.json")
        .header("Authorization", user2Token)

    val responseJson = mockMvc.perform(request)
        .andExpect(MockMvcResultMatchers.status().isOk)
        .andReturn()
        .response.contentAsString

    val response = objectMapper.readValue(responseJson, AllOrdersResponse::class.java)

    assertThat(response.allOrdersList).hasSize(1)

    assertThat(response.allOrdersList[0].restaurantName).isEqualTo(restaurant.name)
    assertThat(response.allOrdersList[0].orderCreatorUsername).isEqualTo(orderCreator.username)
    assertThat(response.allOrdersList[0].orderDate).isEqualTo(orderDate)
  }

  @Test
  fun shouldReturnOrdersFromTodayAndFromPast() {
    val team1 = testFactoriesService.createTeam1()
    val orderCreator = testFactoriesService.createUser1(team1)

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
    orderService.saveOrder(orderSaveRequest1, orderCreator, team1)

    val ysterdayOrderDate = LocalDate.now().minusDays(1)
    val orderSaveRequest2 = OrderSaveRequest(
        restaurant2.id,
        ysterdayOrderDate,
        timeOfOrder = null,
        deliveryData = DeliveryData(),
        paymentData = PaymentData()
    )
    orderService.saveOrder(orderSaveRequest2, orderCreator, team1)

    val (token, user) = testFactoriesService.createUser2WithToken(team1)

    val request = MockMvcRequestBuilders.get("/api/orders/all.json")
        .header("Authorization", token)

    val responseJson = mockMvc.perform(request)
        .andExpect(MockMvcResultMatchers.status().isOk)
        .andReturn()
        .response.contentAsString

    val response = objectMapper.readValue(responseJson, AllOrdersResponse::class.java)

    assertThat(response.allOrdersList).hasSize(2)
  }

  @Test
  fun shouldReturnOrdersFromTheCorrectTeam() {
    val todayOrderDate = LocalDate.now()

    val team1 = testFactoriesService.createTeam1()
    val orderCreator1 = testFactoriesService.createUser1(team1)

    val restaurant1 = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1"))

    val orderSaveRequest1 = OrderSaveRequest(
        restaurant1.id,
        todayOrderDate,
        timeOfOrder = null,
        deliveryData = DeliveryData(),
        paymentData = PaymentData()
    )
    orderService.saveOrder(orderSaveRequest1, orderCreator1, team1)

    val team2 = testFactoriesService.createTeam2()
    val orderCreator2 = testFactoriesService.createUser2(team1)

    val restaurant2 = restaurantService.createRestaurant(team2, RestaurantSaveRequest("Restaurant 2"))

    val orderSaveRequest2 = OrderSaveRequest(
        restaurant2.id,
        todayOrderDate,
        timeOfOrder = null,
        deliveryData = DeliveryData(),
        paymentData = PaymentData()
    )
    orderService.saveOrder(orderSaveRequest2, orderCreator2, team2)



    val (token, user3) = testFactoriesService.createUser3WithToken(team1)

    val request = MockMvcRequestBuilders.get("/api/orders/all.json")
        .header("Authorization", token)

    val responseJson = mockMvc.perform(request)
        .andExpect(MockMvcResultMatchers.status().isOk)
        .andReturn()
        .response.contentAsString

    val response = objectMapper.readValue(responseJson, AllOrdersResponse::class.java)

    assertThat(response.allOrdersList).hasSize(1)

    assertThat(response.allOrdersList[0].restaurantName).isEqualTo("Restaurant 1")
    assertThat(response.allOrdersList[0].orderCreatorUsername).isEqualTo(orderCreator1.username)
    assertThat(response.allOrdersList[0].orderDate).isEqualTo(todayOrderDate)
  }

}
