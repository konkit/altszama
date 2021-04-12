package altszama.app.restaurant

import altszama.app.test.AbstractIntegrationTest
import altszama.app.test.TestFactoriesService
import altszama.app.validation.NoAccessToRestaurant
import altszama.app.validation.RestaurantDoesNotExist
import com.fasterxml.jackson.databind.ObjectMapper
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers

internal class RestaurantControllerEditTest : AbstractIntegrationTest() {

  @Autowired
  private lateinit var mockMvc: MockMvc

  @Autowired
  private lateinit var restaurantService: RestaurantService

  @Autowired
  private lateinit var objectMapper: ObjectMapper

  @Autowired
  private lateinit var testFactoriesService: TestFactoriesService


  @Test
  fun itShouldShowEditRestaurantResponseSuccessfully() {
    val team1 = testFactoriesService.createTeam1()
    val (user1Token, user1) = testFactoriesService.createUser1WithToken(team1)

    val (restaurant, dishes) = testFactoriesService.createRestaurantAndDishes(team1)

    val request = MockMvcRequestBuilders.get("/api/restaurants/${restaurant.id}/edit.json")
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user1Token)

    val response = mockMvc.perform(request)
        .andExpect(MockMvcResultMatchers.status().isOk)
        .andReturn()
        .response.contentAsString

    val showResponse = objectMapper.readTree(response)

    assertThat(showResponse["id"].asText()).isEqualTo(restaurant.id)
    assertThat(showResponse["name"].asText()).isEqualTo(restaurant.name)
  }

  @Test
  fun itShouldNotShowEditRestaurantResponseIfRestaurantDoesNotExist() {
    val team1 = testFactoriesService.createTeam1()
    val (user1Token, user1) = testFactoriesService.createUser1WithToken(team1)

    val fakeRestaurantId = "111111111111111111111111"

    val request = MockMvcRequestBuilders.get("/api/restaurants/${fakeRestaurantId}/edit.json")
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user1Token)

    expectBadRequestWithMessage(request, RestaurantDoesNotExist().message)
  }

  @Test
  fun itShouldNotShowEditRestaurantResponseIfUserHasNoAccessToRestaurant() {
    val team1 = testFactoriesService.createTeam1()
    val (user1Token, user1) = testFactoriesService.createUser1WithToken(team1)

    val team2 = testFactoriesService.createTeam2()

    val (restaurant, dishes) = testFactoriesService.createRestaurantAndDishes(team2)

    val request = MockMvcRequestBuilders.get("/api/restaurants/${restaurant.id}/edit.json")
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user1Token)

    expectBadRequestWithMessage(request, NoAccessToRestaurant().message)
  }
}
