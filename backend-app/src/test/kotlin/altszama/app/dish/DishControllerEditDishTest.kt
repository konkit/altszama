package altszama.app.dish

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

internal class DishControllerEditDishTest : AbstractIntegrationTest() {

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


  @Test
  fun itShouldReturnEditDishDataSuccessfully() {
    val team1 = teamService.createTeam("team1.com", "", listOf("james1@team1.com"))
    val (user1Token, user) = createUserAndGetToken("James1", "james1@team1.com")

    val restaurant = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1", address = "Address 1"))

    val dish1 = dishService.saveDish(team1, restaurant.id, DishCreateRequest("Dish 1", 100, category = "Category 1"))

    val request = MockMvcRequestBuilders.get("/api/restaurants/${restaurant.id}/dishes/${dish1.id}/edit.json")
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user1Token)

    val response = mockMvc.perform(request)
        .andExpect(MockMvcResultMatchers.status().isOk)
        .andReturn()
        .response.contentAsString

    assertThat(objectMapper.readTree(response)["dish"]["name"].asText()).isEqualTo("Dish 1")

    assertThat(objectMapper.readTree(response)["categories"].asIterable().map { x -> x.asText()})
        .hasSameElementsAs(listOf("Category 1"))
  }

  @Test
  fun itShouldNotReturnEditDishDataIfRestaurantDoesNotExist() {
    val team1 = teamService.createTeam("team1.com", "", listOf("james1@team1.com"))
    val (user1Token, user) = createUserAndGetToken("James1", "james1@team1.com")

    val fakeRestaurantId = "111111111111111111111111"
    val fakeDishId = "111111111111111111111112"

    val request = MockMvcRequestBuilders.get("/api/restaurants/${fakeRestaurantId}/dishes/${fakeDishId}/edit.json")
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user1Token)

    expectBadRequestWithMessage(request, "Restaurant does not exist")
  }

  @Test
  fun itShouldNotReturnEditDishDataIfDishDoesNotExist() {
    val team1 = teamService.createTeam("team1.com", "", listOf("james1@team1.com"))
    val (user1Token, user) = createUserAndGetToken("James1", "james1@team1.com")

    val restaurant = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1", address = "Address 1"))

    val fakeDishId = "111111111111111111111112"

    val request = MockMvcRequestBuilders.get("/api/restaurants/${restaurant.id}/dishes/${fakeDishId}/edit.json")
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user1Token)

    expectBadRequestWithMessage(request, "Dish does not exist")
  }

  @Test
  fun itShouldNotReturnEditDishDataIfUserHasNoAccessToRestaurant() {
    val team1 = teamService.createTeam("team1.com", "team1.com", listOf("james1@team1.com"))
    val (user1Token, user) = createUserAndGetToken("James1", "james1@team1.com")

    val team2 = teamService.createTeam("team2.com", "team2.com", listOf("james2@team2.com"))

    val restaurant = restaurantService.createRestaurant(team2, RestaurantSaveRequest("Restaurant 1", address = "Address 1"))

    val dish1 = dishService.saveDish(team2, restaurant.id, DishCreateRequest("Dish 1", 100, category = "Category 1"))

    val request = MockMvcRequestBuilders.get("/api/restaurants/${restaurant.id}/dishes/${dish1.id}/edit.json")
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user1Token)

    expectBadRequestWithMessage(request, "You have no access to this restaurant")
  }
}
