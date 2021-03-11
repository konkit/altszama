package altszama.app.dish

import altszama.app.auth.UserService
import altszama.app.dish.dto.DishCreateRequest
import altszama.app.order.OrderService
import altszama.app.order.dto.DeliveryData
import altszama.app.order.dto.OrderSaveRequest
import altszama.app.order.dto.PaymentData
import altszama.app.orderEntry.OrderEntryService
import altszama.app.orderEntry.dto.OrderEntrySaveRequest
import altszama.app.orderEntry.dto.SideDishData
import altszama.app.restaurant.RestaurantService
import altszama.app.restaurant.dto.RestaurantSaveRequest
import altszama.app.team.TeamService
import altszama.app.test.AbstractIntegrationTest
import altszama.app.validation.SideDishInUse
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

internal class DishControllerDeleteSideDishTest : AbstractIntegrationTest() {

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
  fun itShouldDeleteSideishSuccessfully() {
    val team1 = teamService.createTeam("team1.com", "", listOf("james1@team1.com"))
    val (user1Token, user) = createUserAndGetToken("James1", "james1@team1.com")

    val restaurant = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1", address = "Address 1"))
    val dishCreateRequest = DishCreateRequest("Dish 1", 100, category = "Category 1", sideDishes = listOf(SideDish(name = "Side dish 1", price = 100)))
    val dish1 = dishService.saveDish(team1, restaurant.id, dishCreateRequest)

    val createdSideDish = dish1.sideDishes.first()

    val request = MockMvcRequestBuilders.delete("/api/dishes/${dish1.id}/side_dishes/${createdSideDish.id}/delete")
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user1Token)

    mockMvc.perform(request)
        .andExpect(MockMvcResultMatchers.status().isOk)

    val dishesInRestaurant = dishService.findAllDishesByRestaurantId(restaurant.id)
    assertThat(dishesInRestaurant[0].sideDishes).hasSize(0)
  }

  @Test
  fun itShouldNotDeleteSideishIfItAlreadyDoesntExist() {
    val team1 = teamService.createTeam("team1.com", "", listOf("james1@team1.com"))
    val (user1Token, user) = createUserAndGetToken("James1", "james1@team1.com")

    val restaurant = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1", address = "Address 1"))
    val dishCreateRequest = DishCreateRequest("Dish 1", 100, category = "Category 1", sideDishes = emptyList())
    val dish1 = dishService.saveDish(team1, restaurant.id, dishCreateRequest)

    val fakeSideDishId = "111111111111111111111111"

    val request = MockMvcRequestBuilders.delete("/api/dishes/${dish1.id}/side_dishes/${fakeSideDishId}/delete")
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user1Token)

    expectBadRequestWithMessage(request, "Side dish does not exist")
  }

  @Test
  fun itShouldNotDeleteSideishIfTheDishDoesNotExist() {
    val team1 = teamService.createTeam("team1.com", "", listOf("james1@team1.com"))
    val (user1Token, user) = createUserAndGetToken("James1", "james1@team1.com")

    val restaurant = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1", address = "Address 1"))

    val fakeDishId = "111111111111111111111111"
    val fakeSideDishId = "111111111111111111111112"

    val request = MockMvcRequestBuilders.delete("/api/dishes/${fakeDishId}/side_dishes/${fakeSideDishId}/delete")
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user1Token)

    expectBadRequestWithMessage(request, "Dish does not exist")
  }

  @Test
  fun itShouldNotDeleteSideishIfUserHasNoAccessToRestaurant() {
    val team1 = teamService.createTeam("team1.com", "", listOf("james1@team1.com"))
    val (user1Token, user) = createUserAndGetToken("James1", "james1@team1.com")

    val team2 = teamService.createTeam("team2.com", "", listOf("james2@team2.com"))

    val restaurant = restaurantService.createRestaurant(team2, RestaurantSaveRequest("Restaurant 1", address = "Address 1"))
    val dishCreateRequest = DishCreateRequest("Dish 1", 100, category = "Category 1", sideDishes = listOf(SideDish(name = "Side dish 1", price = 100)))
    val dish1 = dishService.saveDish(team2, restaurant.id, dishCreateRequest)

    val createdSideDish = dish1.sideDishes.first()

    val request = MockMvcRequestBuilders.delete("/api/dishes/${dish1.id}/side_dishes/${createdSideDish.id}/delete")
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user1Token)

    expectBadRequestWithMessage(request, "You have no access to this restaurant")
  }

  @Test
  fun itShouldNotDeleteSidedishIfItIsIsUse() {
    val team1 = teamService.createTeam("team1.com", "", listOf("james1@team1.com"))
    val (user1Token, user1) = createUserAndGetToken("James1", "james1@team1.com")

    val restaurant = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1", address = "Address 1"))
    val dishCreateRequest = DishCreateRequest("Dish 1", 100, category = "Category 1", sideDishes = listOf(SideDish(name = "Side dish 1", price = 100)))
    val dish1 = dishService.saveDish(team1, restaurant.id, dishCreateRequest)

    val createdSideDish = dish1.sideDishes.first()

    val orderSaveRequest = OrderSaveRequest(restaurantId = restaurant.id, orderDate = LocalDate.now(), timeOfOrder = LocalTime.of(14, 0), deliveryData = DeliveryData(), paymentData = PaymentData())
    val order = orderService.saveOrder(orderSaveRequest, currentUser = user1, currentUserTeam = team1)

    val orderEntrySaveRequest = OrderEntrySaveRequest(orderId = order.id, dishId = dish1.id, newDish = false, newDishName = null, newDishPrice = null, sideDishes = listOf(SideDishData(id = createdSideDish.id, isNew = null, newSideDishName = null, newSideDishPrice = null)))
    val orderEntry = orderEntryService.saveEntry(user1, orderEntrySaveRequest)

    val request = MockMvcRequestBuilders.delete("/api/dishes/${dish1.id}/side_dishes/${createdSideDish.id}/delete")
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user1Token)

    expectBadRequestWithMessage(request, SideDishInUse().message)
  }


}
