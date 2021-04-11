package altszama.app.order.controller

import altszama.app.dish.DishService
import altszama.app.dish.dto.DishCreateRequest
import altszama.app.order.OrderControllerDataService
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
import java.time.format.DateTimeFormatter

class OrderControllerSaveOrderTest() : AbstractIntegrationTest() {

  @Autowired
  private lateinit var mockMvc: MockMvc

  @Autowired
  private lateinit var restaurantService: RestaurantService

  @Autowired
  private lateinit var dishService: DishService

  @Autowired
  private lateinit var orderControllerDataService: OrderControllerDataService

  @Autowired
  private lateinit var testFactoriesService: TestFactoriesService


  @Test
  fun itShouldReturnSaveOrderSuccessfully() {
    val team1 = testFactoriesService.createTeam1()
    val (user1Token, user1) = testFactoriesService.createUser1WithToken(team1)

    val restaurant = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1"))
    val dish1 = dishService.saveDish(team1, restaurant.id, DishCreateRequest("Dish 1", 100, category = "Category 1"))

    val nowDate = LocalDate.now()
    val createContent = """{
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

    val request = MockMvcRequestBuilders.post("/api/orders/save")
        .content(createContent)
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user1Token)

    mockMvc.perform(request)
        .andExpect(MockMvcResultMatchers.status().isOk)

    assertThat(orderControllerDataService.getAllOrdersData(team1).allOrdersList).hasSize(1)
    assertThat(orderControllerDataService.getAllOrdersData(team1).allOrdersList[0].restaurantName).isEqualTo(restaurant.name)
  }

  @Test
  fun itShouldNotSaveOrderIfTheRestaurantDoesNotExist() {
    val team1 = testFactoriesService.createTeam1()
    val (user1Token, user1) = testFactoriesService.createUser1WithToken(team1)

    val nowDate = LocalDate.now()
    val createContent = """{
        "restaurantId": "111111111111111111111111",
        "orderDate": "${nowDate.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"))}",
        "deliveryData": {},
        "paymentData": {}
    }""".trimIndent()

    val request = MockMvcRequestBuilders.post("/api/orders/save")
        .content(createContent)
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user1Token)

    expectBadRequestWithMessage(request, "Restaurant does not exist")
  }

  @Test
  fun itShouldNotSaveOrderIfUserHasNoAccessToTheRestaurant() {
    val team1 = testFactoriesService.createTeam1()

    val restaurant = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1"))
    val dish1 = dishService.saveDish(team1, restaurant.id, DishCreateRequest("Dish 1", 100, category = "Category 1"))

    val team2 = testFactoriesService.createTeam2()
    val (user2Token, user2) = testFactoriesService.createUser2WithToken(team2)

    val nowDate = LocalDate.now()
    val createContent = """{
        "restaurantId": "${restaurant.id}",
        "orderDate": "${nowDate.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"))}",
        "deliveryData": {},
        "paymentData": {}
    }""".trimIndent()

    val request = MockMvcRequestBuilders.post("/api/orders/save")
        .content(createContent)
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user2Token)

    expectBadRequestWithMessage(request, "You have no access to this restaurant")
  }

  @Test
  fun itShouldNotSaveOrderWithoutOrderDate() {
    val team1 = testFactoriesService.createTeam1()
    val (user1Token, user1) = testFactoriesService.createUser1WithToken(team1)

    val restaurant = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1"))
    val dish1 = dishService.saveDish(team1, restaurant.id, DishCreateRequest("Dish 1", 100, category = "Category 1"))

    val nowDate = LocalDate.now()
    val createContent = """{
        "restaurantId": "${restaurant.id}",
        "deliveryData": {},
        "paymentData": {}
    }""".trimIndent()

    val request = MockMvcRequestBuilders.post("/api/orders/save")
        .content(createContent)
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user1Token)

    expectBadRequestWithMessage(request, "Order date is invalid")
  }

  @Test
  fun itShouldNotSaveOrderWithInvalidBankTransferNumber() {
    val team1 = testFactoriesService.createTeam1()
    val (user1Token, user1) = testFactoriesService.createUser1WithToken(team1)

    val restaurant = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1"))
    val dish1 = dishService.saveDish(team1, restaurant.id, DishCreateRequest("Dish 1", 100, category = "Category 1"))

    val nowDate = LocalDate.now()
    val createContent = """{
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

    val request = MockMvcRequestBuilders.post("/api/orders/save")
        .content(createContent)
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user1Token)

    expectBadRequestWithMessage(request, "Bank transfer number is not specified")
  }

}
