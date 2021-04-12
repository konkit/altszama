package altszama.app.restaurant

import altszama.app.dish.DishService
import altszama.app.order.OrderService
import altszama.app.order.dto.DeliveryData
import altszama.app.order.dto.OrderSaveRequest
import altszama.app.order.dto.PaymentData
import altszama.app.test.AbstractIntegrationTest
import altszama.app.test.TestFactoriesService
import altszama.app.validation.NoAccessToRestaurant
import altszama.app.validation.RestaurantDoesNotExist
import altszama.app.validation.RestaurantInUseException
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import java.time.LocalDate
import java.time.LocalTime

internal class RestaurantControllerDeleteTest : AbstractIntegrationTest() {

  @Autowired
  private lateinit var mockMvc: MockMvc

  @Autowired
  private lateinit var restaurantService: RestaurantService

  @Autowired
  private lateinit var dishService: DishService

  @Autowired
  private lateinit var orderService: OrderService

  @Autowired
  private lateinit var testFactoriesService: TestFactoriesService


  @Test
  fun itShouldDeleteRestaurantSuccessfully() {
    val team1 = testFactoriesService.createTeam1()
    val (user1Token, user1) = testFactoriesService.createUser1WithToken(team1)

    val (restaurant, dishes) = testFactoriesService.createRestaurantAndDishes(team1)

    val request = MockMvcRequestBuilders.delete("/api/restaurants/${restaurant.id}/delete")
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user1Token)

    mockMvc.perform(request)
        .andExpect(MockMvcResultMatchers.status().isOk)
        .andReturn()
        .response.contentAsString

    assertThat(restaurantService.findById(restaurant.id)).isEmpty
    dishes.forEach { dish -> assertThat(dishService.findDishById(dish.id)).isEmpty }
  }

  @Test
  fun itShouldFailToDeleteRestaurantIfItDoesNotExist() {
    val team1 = testFactoriesService.createTeam1()
    val (user1Token, user1) = testFactoriesService.createUser1WithToken(team1)

    val team2 = testFactoriesService.createTeam2()

    val fakeRestaurantId = "111111111111111111111111"

    val request = MockMvcRequestBuilders.delete("/api/restaurants/${fakeRestaurantId}/delete")
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user1Token)

    expectBadRequestWithMessage(request, RestaurantDoesNotExist().message)
  }

  @Test
  fun itShouldFailToDeleteRestaurantIfTheTeamIsWrong() {
    val team1 = testFactoriesService.createTeam1()
    val (user1Token, user1) = testFactoriesService.createUser1WithToken(team1)

    val team2 = testFactoriesService.createTeam2()
    val (restaurant, dishes) = testFactoriesService.createRestaurantAndDishes(team2)

    val request = MockMvcRequestBuilders.delete("/api/restaurants/${restaurant.id}/delete")
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user1Token)

    expectBadRequestWithMessage(request, NoAccessToRestaurant().message)

    val deletedRestaurantOpt = restaurantService.findById(restaurant.id)

    assertThat(deletedRestaurantOpt).isNotEmpty
  }

  @Test
  fun itShouldFailToDeleteRestaurantIfItIsInUse() {
    val team1 = testFactoriesService.createTeam1()
    val (user1Token, user1) = testFactoriesService.createUser1WithToken(team1)

    val (restaurant, dishes) = testFactoriesService.createRestaurantAndDishes(team1)

    val orderSaveRequest = OrderSaveRequest(restaurantId = restaurant.id, orderDate = LocalDate.now(), timeOfOrder = LocalTime.of(14, 0), deliveryData = DeliveryData(), paymentData = PaymentData())
    val order = orderService.saveOrder(orderSaveRequest, currentUser = user1, currentUserTeam = team1)
    testFactoriesService.createOrderEntry(order, dishes[0], user1, team1)

    val request = MockMvcRequestBuilders.delete("/api/restaurants/${restaurant.id}/delete")
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user1Token)

    expectBadRequestWithMessage(request, RestaurantInUseException().message)
  }
}
