package altszama.app.order.controller

import altszama.app.dish.DishService
import altszama.app.dish.dto.DishCreateRequest
import altszama.app.dish.dto.DishDto
import altszama.app.order.OrderService
import altszama.app.order.dto.DeliveryData
import altszama.app.order.dto.OrderSaveRequest
import altszama.app.order.dto.PaymentData
import altszama.app.order.dto.ShowOrderResponse
import altszama.app.restaurant.RestaurantService
import altszama.app.restaurant.dto.RestaurantSaveRequest
import altszama.app.test.AbstractIntegrationTest
import altszama.app.test.TestFactoriesService
import com.fasterxml.jackson.databind.ObjectMapper
import org.assertj.core.api.Assertions
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import java.time.LocalDate

class OrderControllerShowOrderTest() : AbstractIntegrationTest() {

  @Autowired
  private lateinit var mockMvc: MockMvc

  @Autowired
  private lateinit var restaurantService: RestaurantService

  @Autowired
  private lateinit var dishService: DishService

  @Autowired
  private lateinit var orderService: OrderService

  @Autowired
  private lateinit var objectMapper: ObjectMapper

  @Autowired
  private lateinit var testFactoriesService: TestFactoriesService


  @Test
  fun itShouldShowOrderSuccessfully() {
    val team1 = testFactoriesService.createTeam1()
    val (user1Token, user1) = testFactoriesService.createUser1WithToken(team1)

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
    val order = orderService.saveOrder(orderSaveRequest, user1, team1)

    val request = MockMvcRequestBuilders.get("/api/orders/${order.id}/show.json")
        .header("Authorization", user1Token)

    val responseJson = mockMvc.perform(request)
        .andExpect(MockMvcResultMatchers.status().isOk)
        .andReturn()
        .response.contentAsString

    val response = objectMapper.readValue(responseJson, ShowOrderResponse::class.java)

    Assertions.assertThat(response.order.id).isEqualTo(order.id)

    Assertions.assertThat(response.allDishesByCategory).isEqualTo(mapOf("Category 1" to listOf(DishDto.fromDish(dish1))))
    Assertions.assertThat(response.allDishesInRestaurant).isEqualTo(listOf(DishDto.fromDish(dish1)))
  }

  @Test
  fun itShouldNotShowOrderIfItDoesntExist() {
    val team1 = testFactoriesService.createTeam1()
    val (user1Token, user1) = testFactoriesService.createUser1WithToken(team1)

    val fakeOrderId = "111111111111111111111111"

    val request = MockMvcRequestBuilders.get("/api/orders/${fakeOrderId}/show.json")
        .header("Authorization", user1Token)

    expectBadRequestWithMessage(request, "Order does not exist")
  }

  @Test
  fun itShouldNotShowOrderIfTheTeamIsWrong() {
    val team1 = testFactoriesService.createTeam1()
    val user1 = testFactoriesService.createUser1(team1)

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
    val order = orderService.saveOrder(orderSaveRequest, user1, team1)

    val team2 = testFactoriesService.createTeam2()
    val (user2Token, user2) = testFactoriesService.createUser1WithToken(team2)

    val request = MockMvcRequestBuilders.get("/api/orders/${order.id}/show.json")
        .header("Authorization", user2Token)

    expectBadRequestWithMessage(request, "You have no access to this order")
  }

}
