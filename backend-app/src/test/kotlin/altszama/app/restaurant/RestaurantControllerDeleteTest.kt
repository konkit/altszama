package altszama.app.restaurant

import altszama.app.auth.UserService
import altszama.app.dish.DishService
import altszama.app.dish.dto.DishCreateRequest
import altszama.app.order.OrderService
import altszama.app.order.dto.DeliveryData
import altszama.app.order.dto.OrderSaveRequest
import altszama.app.order.dto.PaymentData
import altszama.app.orderEntry.OrderEntryService
import altszama.app.restaurant.dto.RestaurantSaveRequest
import altszama.app.team.TeamService
import altszama.app.test.AbstractIntegrationTest
import altszama.app.validation.NoAccessToRestaurant
import altszama.app.validation.RestaurantDoesNotExist
import altszama.app.validation.RestaurantInUseException
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

internal class RestaurantControllerDeleteTest : AbstractIntegrationTest() {

  @Autowired
  private lateinit var mockMvc: MockMvc

  @Autowired
  private lateinit var teamService: TeamService

  @Autowired
  private lateinit var restaurantService: RestaurantService

  @Autowired
  private lateinit var userService: UserService

  @Autowired
  private lateinit var dishService: DishService

  @Autowired
  private lateinit var orderService: OrderService

  @Autowired
  private lateinit var orderEntryService: OrderEntryService

  @Autowired
  private lateinit var objectMapper: ObjectMapper


  @Test
  fun itShouldDeleteRestaurantSuccessfully() {
    val team1 = teamService.createTeam("team1.com", "", listOf("james1@team1.com"))
    val (user1Token, user1) = createUserAndGetToken("James1", "james1@team1.com")

    val restaurant = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1", address = "Address 1"))

    val dishCreateRequest = DishCreateRequest("Dish 1", 100, category = "Category 1")
    val dish1 = dishService.saveDish(team1, restaurant.id, dishCreateRequest)

    val request = MockMvcRequestBuilders.delete("/api/restaurants/${restaurant.id}/delete")
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user1Token)

    mockMvc.perform(request)
        .andExpect(MockMvcResultMatchers.status().isOk)
        .andReturn()
        .response.contentAsString

    assertThat(restaurantService.findById(restaurant.id)).isEmpty
    assertThat(dishService.findDishById(dish1.id)).isEmpty
  }

  @Test
  fun itShouldFailToDeleteRestaurantIfItDoesNotExist() {
    val team1 = teamService.createTeam("team1.com", "team1.com", listOf("james1@team1.com"))
    val (user1Token, user1) = createUserAndGetToken("James1", "james1@team1.com")

    val team2 = teamService.createTeam("team2.com", "team2.com", listOf("james2@team2.com"))

    val fakeRestaurantId = "111111111111111111111111"

    val request = MockMvcRequestBuilders.delete("/api/restaurants/${fakeRestaurantId}/delete")
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user1Token)

    expectBadRequestWithMessage(request, RestaurantDoesNotExist().message)
  }

  @Test
  fun itShouldFailToDeleteRestaurantIfTheTeamIsWrong() {
    val team1 = teamService.createTeam("team1.com", "team1.com", listOf("james1@team1.com"))
    val (user1Token, user1) = createUserAndGetToken("James1", "james1@team1.com")

    val team2 = teamService.createTeam("team2.com", "team2.com", listOf("james2@team2.com"))

    val restaurant = restaurantService.createRestaurant(team2, RestaurantSaveRequest("Restaurant 1", address = "Address 1"))

    val request = MockMvcRequestBuilders.delete("/api/restaurants/${restaurant.id}/delete")
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user1Token)

    expectBadRequestWithMessage(request, NoAccessToRestaurant().message)

    val deletedRestaurantOpt = restaurantService.findById(restaurant.id)

    assertThat(deletedRestaurantOpt).isNotEmpty
  }

  @Test
  fun itShouldFailToDeleteRestaurantIfItIsInUse() {
    val team1 = teamService.createTeam("team1.com", "", listOf("james1@team1.com"))
    val (user1Token, user1) = createUserAndGetToken("James1", "james1@team1.com")

    val restaurant = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1", address = "Address 1"))
    val dishCreateRequest = DishCreateRequest("Dish 1", 100, category = "Category 1", sideDishes = emptyList())
    val dish1 = dishService.saveDish(team1, restaurant.id, dishCreateRequest)

    val orderSaveRequest = OrderSaveRequest(restaurantId = restaurant.id, orderDate = LocalDate.now(), timeOfOrder = LocalTime.of(14, 0), deliveryData = DeliveryData(), paymentData = PaymentData())
    val order = orderService.saveOrder(orderSaveRequest, currentUser = user1, currentUserTeam = team1)
    createOrderEntry(order, dish1, user1, team1)

    val request = MockMvcRequestBuilders.delete("/api/restaurants/${restaurant.id}/delete")
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user1Token)

    expectBadRequestWithMessage(request, RestaurantInUseException().message)
  }
}
