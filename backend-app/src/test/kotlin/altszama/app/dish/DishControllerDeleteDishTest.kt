package altszama.app.dish

import altszama.app.auth.UserService
import altszama.app.dish.dto.DishCreateRequest
import altszama.app.order.OrderService
import altszama.app.order.dto.DeliveryData
import altszama.app.order.dto.OrderSaveRequest
import altszama.app.order.dto.PaymentData
import altszama.app.orderEntry.OrderEntryService
import altszama.app.orderEntry.dto.OrderEntrySaveRequest
import altszama.app.restaurant.RestaurantService
import altszama.app.restaurant.dto.RestaurantSaveRequest
import altszama.app.team.TeamService
import altszama.app.test.AbstractIntegrationTest
import altszama.app.validation.DishInUse
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

internal class DishControllerDeleteDishTest : AbstractIntegrationTest() {

  @Autowired
  private lateinit var dishService: DishService

  @Autowired
  private lateinit var mockMvc: MockMvc

  @Autowired
  private lateinit var teamService: TeamService

  @Autowired
  private lateinit var restaurantService: RestaurantService

  @Autowired
  private lateinit var objectMapper: ObjectMapper

  @Autowired
  private lateinit var orderService: OrderService

  @Autowired
  private lateinit var orderEntryService: OrderEntryService

  @Autowired
  private lateinit var userService: UserService


  @Test
  fun itShouldDeleteDishSuccessfully() {
    val user1Token = createUserAndGetToken("James1", "james1@team1.com")

    val team1 = teamService.createTeam("team1.com", "", listOf("james1@team1.com"))

    val restaurant = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1", address = "Address 1"))
    val dish1 = dishService.saveDish(team1, restaurant.id, DishCreateRequest("Dish 1", 100, category = "Category 1"))

    val request = MockMvcRequestBuilders.delete("/api/dishes/${dish1.id}/delete")
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user1Token)

    mockMvc.perform(request)
        .andExpect(MockMvcResultMatchers.status().isOk)

    val dishesInRestaurant = dishService.findAllDishesByRestaurantId(restaurant.id)
    assertThat(dishesInRestaurant).hasSize(0)
  }

  @Test
  fun itShouldNotDeleteDishIfDishAlreadyDoesNotExist() {
    val user1Token = createUserAndGetToken("James1", "james1@team1.com")

    val team1 = teamService.createTeam("team1.com", "", listOf("james1@team1.com"))

    val fakeDishId = "111111111111111111111111"

    val request = MockMvcRequestBuilders.delete("/api/dishes/${fakeDishId}/delete")
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user1Token)

    val response = mockMvc.perform(request)
        .andExpect(MockMvcResultMatchers.status().isBadRequest)
        .andReturn()
        .response.contentAsString

    assertThat(objectMapper.readTree(response)["message"].asText()).isEqualTo("Dish does not exist")
  }

  @Test
  fun itShouldNotDeleteDishIfUserHasNoAccessToRestaurant() {
    val user1Token = createUserAndGetToken("James1", "james1@team1.com")

    val team1 = teamService.createTeam("team1.com", "", listOf("james1@team1.com"))
    val team2 = teamService.createTeam("team2.com", "", listOf("james2@team2.com"))

    val restaurant = restaurantService.createRestaurant(team2, RestaurantSaveRequest("Restaurant 1", address = "Address 1"))
    val dish1 = dishService.saveDish(team2, restaurant.id, DishCreateRequest("Dish 1", 100, category = "Category 1"))

    val request = MockMvcRequestBuilders.delete("/api/dishes/${dish1.id}/delete")
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user1Token)

    val response = mockMvc.perform(request)
        .andExpect(MockMvcResultMatchers.status().isBadRequest)
        .andReturn()
        .response.contentAsString

    assertThat(objectMapper.readTree(response)["message"].asText()).isEqualTo("You have no access to this restaurant")
  }

  @Test
  fun itShouldNotDeleteDishIfItIsIsUse() {
    val user1Token = createUserAndGetToken("James1", "james1@team1.com")
    val user1 = userService.findByEmail("james1@team1.com").get()

    val team1 = teamService.createTeam("team1.com", "", listOf("james1@team1.com"))

    val restaurant = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1", address = "Address 1"))
    val dish1 = dishService.saveDish(team1, restaurant.id, DishCreateRequest("Dish 1", 100, category = "Category 1"))

    val orderSaveRequest = OrderSaveRequest(restaurantId = restaurant.id, teamId = team1.id, orderDate = LocalDate.now(), timeOfOrder = LocalTime.of(14, 0), deliveryData = DeliveryData(), paymentData = PaymentData())
    val order = orderService.saveOrder(orderSaveRequest, currentUser = user1)

    val orderEntrySaveRequest = OrderEntrySaveRequest(orderId = order.id, dishId = dish1.id, newDish = false, newDishName = null, newDishPrice = null)
    val orderEntry = orderEntryService.saveEntry(user1, orderEntrySaveRequest)

    val request = MockMvcRequestBuilders.delete("/api/dishes/${dish1.id}/delete")
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user1Token)

    val response = mockMvc.perform(request)
        .andExpect(MockMvcResultMatchers.status().isBadRequest)
        .andReturn()
        .response.contentAsString

    assertThat(objectMapper.readTree(response)["message"].asText()).isEqualTo(DishInUse().message)
  }

}
