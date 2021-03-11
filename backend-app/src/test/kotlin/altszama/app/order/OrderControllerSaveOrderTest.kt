package altszama.app.order

import altszama.app.auth.UserService
import altszama.app.dish.DishService
import altszama.app.dish.dto.DishCreateRequest
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
import java.time.format.DateTimeFormatter

class OrderControllerSaveOrderTest() : AbstractIntegrationTest() {

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
  private lateinit var orderControllerDataService: OrderControllerDataService

  @Autowired
  private lateinit var objectMapper: ObjectMapper


  @Test
  fun itShouldReturnSaveOrderSuccessfully() {
    val team1 = teamService.createTeam("team1.com", "team1.com")

    val restaurant = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1"))
    val dish1 = dishService.saveDish(team1, restaurant.id, DishCreateRequest("Dish 1", 100, category = "Category 1"))

    val token = createUserAndGetToken("John", "john@team1.com")


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
        .header("Authorization", token)

    mockMvc.perform(request)
        .andExpect(MockMvcResultMatchers.status().isOk)

    assertThat(orderControllerDataService.getAllOrdersData(team1).allOrdersList).hasSize(1)
    assertThat(orderControllerDataService.getAllOrdersData(team1).allOrdersList[0].restaurantName).isEqualTo(restaurant.name)
  }

  @Test
  fun itShouldNotSaveOrderIfTheRestaurantDoesNotExist() {
    val team1 = teamService.createTeam("team1.com", "team1.com")

    val token = createUserAndGetToken("John", "john@team1.com")

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
        .header("Authorization", token)

    expectBadRequestWithMessage(request, "Restaurant does not exist")
  }

  @Test
  fun itShouldNotSaveOrderIfUserHasNoAccessToTheRestaurant() {
    val team1 = teamService.createTeam("team1.com", "team1.com")

    val restaurant = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1"))
    val dish1 = dishService.saveDish(team1, restaurant.id, DishCreateRequest("Dish 1", 100, category = "Category 1"))

    val team2 = teamService.createTeam("team2.com", "team2.com")
    val token = createUserAndGetToken("John", "john@team2.com")

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
        .header("Authorization", token)

    expectBadRequestWithMessage(request, "You have no access to this restaurant")
  }

  @Test
  fun itShouldNotSaveOrderWithoutOrderDate() {
    val team1 = teamService.createTeam("team1.com", "team1.com")

    val restaurant = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1"))
    val dish1 = dishService.saveDish(team1, restaurant.id, DishCreateRequest("Dish 1", 100, category = "Category 1"))

    val token = createUserAndGetToken("John", "john@team1.com")


    val nowDate = LocalDate.now()
    val createContent = """{
        "restaurantId": "${restaurant.id}",
        "deliveryData": {},
        "paymentData": {}
    }""".trimIndent()

    val request = MockMvcRequestBuilders.post("/api/orders/save")
        .content(createContent)
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", token)

    expectBadRequestWithMessage(request, "Order date is invalid")
  }

  @Test
  fun itShouldNotSaveOrderWithInvalidBankTransferNumber() {
    val team1 = teamService.createTeam("team1.com", "team1.com")

    val restaurant = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1"))
    val dish1 = dishService.saveDish(team1, restaurant.id, DishCreateRequest("Dish 1", 100, category = "Category 1"))

    val token = createUserAndGetToken("John", "john@team1.com")

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
        .header("Authorization", token)

    expectBadRequestWithMessage(request, "Bank transfer number is not specified")
  }

}
