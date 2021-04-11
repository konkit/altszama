package altszama.app.test

import altszama.app.TestInitializer
import altszama.app.auth.User
import altszama.app.auth.UserService
import altszama.app.dish.Dish
import altszama.app.dish.DishService
import altszama.app.dish.SideDish
import altszama.app.dish.dto.DishCreateRequest
import altszama.app.order.Order
import altszama.app.order.OrderService
import altszama.app.order.dto.DeliveryData
import altszama.app.order.dto.OrderSaveRequest
import altszama.app.order.dto.PaymentData
import altszama.app.orderEntry.OrderEntry
import altszama.app.orderEntry.OrderEntryService
import altszama.app.orderEntry.dto.OrderEntrySaveRequest
import altszama.app.restaurant.Restaurant
import altszama.app.restaurant.RestaurantService
import altszama.app.restaurant.dto.RestaurantSaveRequest
import altszama.app.team.Team
import com.fasterxml.jackson.databind.ObjectMapper
import com.mongodb.BasicDBObject
import org.assertj.core.api.Assertions
import org.junit.jupiter.api.BeforeEach
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.data.mongodb.core.MongoTemplate
import org.springframework.test.context.ContextConfiguration
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import java.time.LocalDate
import java.time.LocalTime


@SpringBootTest(properties = ["spring.main.allow-bean-definition-overriding=true"])
@AutoConfigureMockMvc
@ContextConfiguration(initializers = [TestInitializer::class])
open class AbstractIntegrationTest() {

  @Autowired
  private lateinit var mongoTemplate: MongoTemplate

  @Autowired
  private lateinit var userService: UserService

  @Autowired
  private lateinit var mockMvc: MockMvc

  @Autowired
  private lateinit var objectMapper: ObjectMapper

  @Autowired
  private lateinit var restaurantService: RestaurantService

  @Autowired
  private lateinit var dishService: DishService

  @Autowired
  private lateinit var orderService: OrderService

  @Autowired
  private lateinit var orderEntryService: OrderEntryService

  protected val fakeOrderId = "111111111111111111111111"

  @BeforeEach
  fun beforeEach() {
    for (collectionName in mongoTemplate.collectionNames) {
      if (!collectionName.startsWith("system.")) {
        mongoTemplate.getCollection(collectionName).deleteMany(BasicDBObject())
      }
    }
  }

  protected fun expectBadRequestWithMessage(request: MockHttpServletRequestBuilder, expectedMessage: String) {
    val response = mockMvc.perform(request)
        .andExpect(MockMvcResultMatchers.status().isBadRequest)
        .andReturn()
        .response.contentAsString

    Assertions.assertThat(objectMapper.readTree(response)["message"].asText()).isEqualTo(expectedMessage)
  }

  protected fun expectUnauthorizedWithMessage(request: MockHttpServletRequestBuilder, expectedMessage: String) {
    val response = mockMvc.perform(request)
      .andExpect(MockMvcResultMatchers.status().isUnauthorized)
      .andReturn()
      .response.contentAsString

    Assertions.assertThat(objectMapper.readTree(response)["message"].asText()).isEqualTo(expectedMessage)
  }

  /**/

  protected fun createRestaurantAndDishes(team1: Team): Pair<Restaurant, List<Dish>> {
    val sideDish1 = SideDish(name = "Side dish 1", price = 100)
    val sideDish2 = SideDish(name = "Side dish 2", price = 120)
    val sideDish3 = SideDish(name = "Side dish 3", price = 150)

    val restaurant = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1"))
    val sideDishesList = listOf(sideDish1, sideDish2, sideDish3)
    val dishCreateRequest1 = DishCreateRequest(
      "Dish 1",
      100,
      category = "Category 1",
      sideDishes = sideDishesList
    )
    val dish1 = dishService.saveDish(team1, restaurant.id, dishCreateRequest1)
    val dishCreateRequest2 = DishCreateRequest(
      "Dish 2",
      120,
      category = "Category 1",
      sideDishes = sideDishesList
    )
    val dish2 = dishService.saveDish(team1, restaurant.id, dishCreateRequest2)
    return Pair(restaurant, listOf(dish1, dish2))
  }

  protected fun createOrder(restaurant: Restaurant, user1: User, team1: Team): Order {
    val orderSaveRequest = OrderSaveRequest(
      restaurantId = restaurant.id,
      orderDate = LocalDate.now(),
      timeOfOrder = LocalTime.of(14, 0),
      deliveryData = DeliveryData(),
      paymentData = PaymentData()
    )
    return orderService.saveOrder(orderSaveRequest, currentUser = user1, currentUserTeam = team1)
  }

  protected fun createOrderEntry(order: Order, dish: Dish, user: User, team: Team): OrderEntry {
    val orderEntrySaveRequest = OrderEntrySaveRequest(
      orderId = order.id,
      dishId = dish.id,
      newDish = false,
      newDishName = null,
      newDishPrice = null,
      sideDishes = emptyList()
    )
    return orderEntryService.saveEntry(user, team, orderEntrySaveRequest)
  }

}
