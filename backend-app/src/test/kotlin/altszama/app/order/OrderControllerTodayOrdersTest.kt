package altszama.app.order

import altszama.app.TestInitializer
import altszama.app.auth.UserService
import altszama.app.dish.DishService
import altszama.app.order.dto.DeliveryData
import altszama.app.order.dto.OrderSaveRequest
import altszama.app.order.dto.PaymentData
import altszama.app.order.dto.TodayOrdersResponse
import altszama.app.restaurant.RestaurantService
import altszama.app.restaurant.dto.RestaurantSaveRequest
import altszama.app.team.TeamService
import altszama.app.test.AbstractIntegrationTest
import com.fasterxml.jackson.databind.ObjectMapper
import com.mongodb.BasicDBObject
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.data.mongodb.core.MongoTemplate
import org.springframework.test.context.ContextConfiguration
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import java.time.LocalDate


//@SpringBootTest(properties = ["spring.main.allow-bean-definition-overriding=true"])
//@AutoConfigureMockMvc
//@ContextConfiguration(initializers = [TestInitializer::class])
//open class OrderControllerTodayOrdersTest() {

open class OrderControllerTodayOrdersTest() : AbstractIntegrationTest() {

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
  private lateinit var objectMapper: ObjectMapper

  @Autowired
  private lateinit var mongoTemplate: MongoTemplate

//  @BeforeEach
//  fun beforeEach() {
//    for (collectionName in mongoTemplate.collectionNames) {
//      if (!collectionName.startsWith("system.")) {
//        mongoTemplate.getCollection(collectionName).deleteMany(BasicDBObject())
//      }
//    }
//  }

  @Test
  fun shouldReturnEmptyOrdersListIfThereAreNoOrders() {
    val token = createUserAndGetToken("John", "john@mail.com")

    val request = get("/api/orders/today.json")
        .header("Authorization", token)

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
    val orderCreator = userService.createNewUser("James", "james@team1.com")

    val team1 = teamService.createTeam("team1.com", "team1.com")

    val restaurant = restaurantService.createRestaurant(team1, RestaurantSaveRequest(team1.id, "Restaurant 1"))
    val orderDate = LocalDate.now()
    val orderSaveRequest = OrderSaveRequest(
        restaurant.id,
        team1.id,
        orderDate,
        timeOfOrder = null,
        deliveryData = DeliveryData(),
        paymentData = PaymentData()
    )
    orderService.saveOrder(orderSaveRequest, orderCreator)

    val token = createUserAndGetToken("John", "john@team1.com")

    val request = get("/api/orders/today.json")
        .header("Authorization", token)

    val responseJson = mockMvc.perform(request)
        .andExpect(status().isOk)
        .andReturn()
        .response.contentAsString

    val response = objectMapper.readValue(responseJson, TodayOrdersResponse::class.java)

    assertThat(response.ordersList).hasSize(1)
    assertThat(response.ordersList[0].restaurantId).isEqualTo(restaurant.id)
    assertThat(response.ordersList[0].restaurantName).isEqualTo(restaurant.name)
    assertThat(response.ordersList[0].orderCreatorId).isEqualTo(orderCreator.id)
    assertThat(response.ordersList[0].orderCreatorUsername).isEqualTo(orderCreator.username)
    assertThat(response.ordersList[0].orderDate).isEqualTo(orderDate)

    assertThat(response.currentOrderEntries).hasSize(0)
  }

//  private fun createUserAndGetToken(username: String, email: String): String {
//    return "Bearer ${userService.createJwtTokenFromUserInfo(username, email).token}"
//  }
}
