package altszama.app.order

import altszama.app.auth.UserService
import altszama.app.dish.DishService
import altszama.app.dish.dto.DishCreateRequest
import altszama.app.order.dto.CreateOrderInitialData
import altszama.app.restaurant.RestaurantService
import altszama.app.restaurant.dto.RestaurantSaveRequest
import altszama.app.team.TeamService
import altszama.app.test.AbstractIntegrationTest
import com.fasterxml.jackson.databind.ObjectMapper
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers

class OrderControllerCreateOrderTest() : AbstractIntegrationTest() {

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


  @Test
  fun itShouldReturnCreateDataSuccessfully() {
    val token = createUserAndGetToken("John", "john@team1.com")
    val team1 = teamService.createTeam("team1.com", "team1.com")

    val restaurant = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1"))
    val dish1 = dishService.saveDish(team1, restaurant.id, DishCreateRequest("Dish 1", 100, category = "Category 1"))

    val request = MockMvcRequestBuilders.get("/api/orders/create.json")
        .header("Authorization", token)

    val responseJson = mockMvc.perform(request)
        .andExpect(MockMvcResultMatchers.status().isOk)
        .andReturn()
        .response.contentAsString

    val response = objectMapper.readValue(responseJson, CreateOrderInitialData::class.java)

    assertThat(response.restaurantsList.map { it.id} ).hasSameElementsAs(listOf(restaurant).map { it.id })
  }

  @Test
  fun itShouldReturnRestaurantsOnlyFromTheCorrectTeam() {
    val team1 = teamService.createTeam("team1.com", "team1.com")
    val restaurant1 = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1"))

    val team2 = teamService.createTeam("team2.com", "team2.com")
    val restaurant2 = restaurantService.createRestaurant(team2, RestaurantSaveRequest("Restaurant 2"))

    val token = createUserAndGetToken("John", "john@team1.com")

    val request = MockMvcRequestBuilders.get("/api/orders/create.json")
        .header("Authorization", token)

    val responseJson = mockMvc.perform(request)
        .andExpect(MockMvcResultMatchers.status().isOk)
        .andReturn()
        .response.contentAsString

    val response = objectMapper.readValue(responseJson, CreateOrderInitialData::class.java)

    assertThat(response.restaurantsList).hasSize(1)
    assertThat(response.restaurantsList.map { it.id} ).hasSameElementsAs(listOf(restaurant1).map { it.id })
  }

}
