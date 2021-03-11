package altszama.app.restaurant

import altszama.app.restaurant.dto.IndexResponse
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

internal class RestaurantControllerListTest : AbstractIntegrationTest() {

  @Autowired
  private lateinit var mockMvc: MockMvc

  @Autowired
  private lateinit var teamService: TeamService

  @Autowired
  private lateinit var restaurantService: RestaurantService

  @Autowired
  private lateinit var objectMapper: ObjectMapper


  @Test
  fun itShouldListRestaurantsOnlyFromMyTeam() {
    val team1 = teamService.createTeam("team1.com", "", listOf("james1@team1.com"))
    val (user1Token, user1) = createUserAndGetToken("James1", "james1@team1.com")

    val team2 = teamService.createTeam("team2.com", "", listOf("james2@team2.com"))

    restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1"))
    restaurantService.createRestaurant(team2, RestaurantSaveRequest("Restaurant 2"))

    val request = MockMvcRequestBuilders.get("/api/restaurants.json")
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user1Token)

    val response = mockMvc.perform(request)
        .andExpect(MockMvcResultMatchers.status().isOk)
        .andReturn()
        .response.contentAsString

    val indexResponse = objectMapper.readValue(response, IndexResponse::class.java)

    assertThat(indexResponse.restaurants).hasSize(1)
    assertThat(indexResponse.restaurants[0].name).isEqualTo("Restaurant 1")

    assertThat(indexResponse.importCredentials.username).isEqualTo(team1.importUsername)
    assertThat(indexResponse.importCredentials.password).isEqualTo(team1.importPassword)
  }
}
