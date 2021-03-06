package altszama.app.order.controller

import altszama.app.dish.DishService
import altszama.app.dish.dto.DishCreateRequest
import altszama.app.order.OrderControllerDataService
import altszama.app.order.OrderService
import altszama.app.order.dto.DeliveryData
import altszama.app.order.dto.OrderSaveRequest
import altszama.app.order.dto.PaymentData
import altszama.app.restaurant.RestaurantService
import altszama.app.restaurant.dto.RestaurantSaveRequest
import altszama.app.test.AbstractIntegrationTest
import altszama.app.test.TestFactoriesService
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

class OrderControllerUpdateOrderTest() : AbstractIntegrationTest() {

  @Autowired
  private lateinit var mockMvc: MockMvc

  @Autowired
  private lateinit var restaurantService: RestaurantService

  @Autowired
  private lateinit var dishService: DishService

  @Autowired
  private lateinit var orderService: OrderService

  @Autowired
  private lateinit var orderControllerDataService: OrderControllerDataService

  @Autowired
  private lateinit var testFactoriesService: TestFactoriesService


  @Test
  fun itShouldUpdateOrderSuccessfully() {
    val team1 = testFactoriesService.createTeam1()
    val (user1Token, user1) = testFactoriesService.createUser1WithToken(team1)

    val restaurant = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1"))
    val dish1 = dishService.saveDish(team1, restaurant.id, DishCreateRequest("Dish 1", 100, category = "Category 1"))

    val orderSaveRequest = OrderSaveRequest(restaurantId = restaurant.id, orderDate = LocalDate.now(), timeOfOrder = LocalTime.of(14, 0), deliveryData = DeliveryData(), paymentData = PaymentData())
    val order = orderService.saveOrder(orderSaveRequest, currentUser = user1, currentUserTeam = team1)
    testFactoriesService.createOrderEntry(order, dish1, user1, team1)

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

    val request = MockMvcRequestBuilders.put("/api/orders/update")
        .content(updateContent)
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user1Token)

    mockMvc.perform(request)
        .andExpect(MockMvcResultMatchers.status().isOk)

    assertThat(orderControllerDataService.getAllOrdersData(team1).allOrdersList).hasSize(1)
    assertThat(orderControllerDataService.getAllOrdersData(team1).allOrdersList[0].restaurantName).isEqualTo(restaurant.name)
  }

  @Test
  fun itShouldNotUpdateOrderIfItDoesNotExist() {
    val team1 = testFactoriesService.createTeam1()
    val (user1Token, user1) = testFactoriesService.createUser1WithToken(team1)

    val restaurant = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1"))
    val dish1 = dishService.saveDish(team1, restaurant.id, DishCreateRequest("Dish 1", 100, category = "Category 1"))

    val fakeOrderId = "111111111"

    val nowDate = LocalDate.now()
    val updateContent = """{
        "orderId": "${fakeOrderId}",
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

    val request = MockMvcRequestBuilders.put("/api/orders/update")
        .content(updateContent)
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user1Token)

    expectBadRequestWithMessage(request, "Order does not exist")
  }

  @Test
  fun itShouldNotUpdateOrderIfItIsNotCreator() {
    val team1 = testFactoriesService.createTeam1()
    val (user1Token, user1) = testFactoriesService.createUser1WithToken(team1)

    val restaurant = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1"))
    val dish1 = dishService.saveDish(team1, restaurant.id, DishCreateRequest("Dish 1", 100, category = "Category 1"))

    val orderSaveRequest = OrderSaveRequest(restaurantId = restaurant.id, orderDate = LocalDate.now(), timeOfOrder = LocalTime.of(14, 0), deliveryData = DeliveryData(), paymentData = PaymentData())
    val order = orderService.saveOrder(orderSaveRequest, currentUser = user1, currentUserTeam = team1)

    val (user2Token, user2) = testFactoriesService.createUser2WithToken(team1)

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

    val request = MockMvcRequestBuilders.put("/api/orders/update")
        .content(updateContent)
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user2Token)

    expectBadRequestWithMessage(request, "You can edit only your own orders")
  }

  @Test
  fun itShouldNotUpdateOrderIfTheOrderDateIsMissing() {
    val team1 = testFactoriesService.createTeam1()
    val (user1Token, user1) = testFactoriesService.createUser1WithToken(team1)

    val restaurant = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1"))
    val dish1 = dishService.saveDish(team1, restaurant.id, DishCreateRequest("Dish 1", 100, category = "Category 1"))

    val orderSaveRequest = OrderSaveRequest(restaurantId = restaurant.id, orderDate = LocalDate.now(), timeOfOrder = LocalTime.of(14, 0), deliveryData = DeliveryData(), paymentData = PaymentData())
    val order = orderService.saveOrder(orderSaveRequest, currentUser = user1, currentUserTeam = team1)
    testFactoriesService.createOrderEntry(order, dish1, user1, team1)

    val nowDate = LocalDate.now()
    val updateContent = """{
        "orderId": "${order.id}",
        "restaurantId": "${restaurant.id}",
        "deliveryData": {},
        "paymentData": {
          "paymentByCash": false,
          "paymentByBankTransfer": false,
          "bankTransferNumber": "",
          "paymentByBlik": false,
          "blikPhoneNumber": ""
        }
    }""".trimIndent()

    val request = MockMvcRequestBuilders.put("/api/orders/update")
        .content(updateContent)
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user1Token)

    expectBadRequestWithMessage(request, "Order date is invalid")
  }

  @Test
  fun itShouldNotUpdateOrderIfTheBankTransferNumberIsMissing() {
    val team1 = testFactoriesService.createTeam1()
    val (user1Token, user1) = testFactoriesService.createUser1WithToken(team1)

    val restaurant = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1"))
    val dish1 = dishService.saveDish(team1, restaurant.id, DishCreateRequest("Dish 1", 100, category = "Category 1"))

    val orderSaveRequest = OrderSaveRequest(restaurantId = restaurant.id, orderDate = LocalDate.now(), timeOfOrder = LocalTime.of(14, 0), deliveryData = DeliveryData(), paymentData = PaymentData())
    val order = orderService.saveOrder(orderSaveRequest, currentUser = user1, currentUserTeam = team1)
    testFactoriesService.createOrderEntry(order, dish1, user1, team1)

    val nowDate = LocalDate.now()
    val updateContent = """{
        "orderId": "${order.id}",
        "restaurantId": "${restaurant.id}",
        "orderDate": "${nowDate.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"))}",
        "deliveryData": {},
        "paymentData": {
          "paymentByCash": false,
          "paymentByBankTransfer": true,
          "bankTransferNumber": "",
          "paymentByBlik": false,
          "blikPhoneNumber": ""
        }
    }""".trimIndent()

    val request = MockMvcRequestBuilders.put("/api/orders/update")
        .content(updateContent)
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user1Token)

    expectBadRequestWithMessage(request, "Bank transfer number is not specified")
  }

}
