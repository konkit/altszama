package altszama.app.restaurant

import altszama.app.test.AbstractIntegrationTest
import altszama.app.test.TestFactoriesService
import com.fasterxml.jackson.databind.ObjectMapper
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers

internal class RestaurantControllerCreateTest : AbstractIntegrationTest() {

  @Autowired
  private lateinit var mockMvc: MockMvc

  @Autowired
  private lateinit var restaurantService: RestaurantService

  @Autowired
  private lateinit var objectMapper: ObjectMapper

  @Autowired
  private lateinit var testFactoriesService: TestFactoriesService


  @Test
  fun itShouldCreateRestaurantSuccessfully() {
    val team1 = testFactoriesService.createTeam1()
    val (user1Token, user1) = testFactoriesService.createUser1WithToken(team1)

    val restaurantSaveDataJson = """{
      "name": "New Restaurant",
      "telephone": "123123123",
      "address": "Privet drive 4",
      "url": "https://google.com"
    }
    """.trimIndent()

    val request = MockMvcRequestBuilders.post("/api/restaurants/save")
        .content(restaurantSaveDataJson)
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user1Token)

    mockMvc.perform(request)
        .andExpect(MockMvcResultMatchers.status().isCreated)

    val restaurant = restaurantService.findByTeamAndName(team1, "New Restaurant")

    assertThat(restaurant).isNotNull
  }

  @Test
  fun itShouldFailToCreateRestaurantWithEmptyName() {
    val team1 = testFactoriesService.createTeam1()
    val (user1Token, user1) = testFactoriesService.createUser1WithToken(team1)

    val restaurantSaveDataJson = """{
      "name": "",
      "telephone": "123123123",
      "address": "Privet drive 4",
      "url": "https://google.com"
    }
    """.trimIndent()

    val request = MockMvcRequestBuilders.post("/api/restaurants/save")
      .content(restaurantSaveDataJson)
      .contentType(MediaType.APPLICATION_JSON)
      .header("Authorization", user1Token)

    val response = mockMvc.perform(request)
      .andExpect(MockMvcResultMatchers.status().isBadRequest)
      .andReturn()
      .response.contentAsString

    assertThat(objectMapper.readTree(response)["message"].asText()).isEqualTo("Restaurant name cannot be blank")

    val restaurant = restaurantService.findByTeamAndName(team1, "New Restaurant")

    assertThat(restaurant).isNull()
  }

  @Test
  fun itShouldFailToCreateRestaurantWithoutName() {
    val team1 = testFactoriesService.createTeam1()
    val (user1Token, user1) = testFactoriesService.createUser1WithToken(team1)

    val restaurantSaveDataJson = """{
      "telephone": "123123123",
      "address": "Privet drive 4",
      "url": "https://google.com"
    }
    """.trimIndent()

    val request = MockMvcRequestBuilders.post("/api/restaurants/save")
        .content(restaurantSaveDataJson)
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user1Token)

    val response = mockMvc.perform(request)
        .andExpect(MockMvcResultMatchers.status().isBadRequest)
        .andReturn()
        .response.contentAsString

    assertThat(objectMapper.readTree(response)["message"].asText()).isEqualTo("Restaurant name cannot be blank")

    val restaurant = restaurantService.findByTeamAndName(team1, "New Restaurant")

    assertThat(restaurant).isNull()
  }
}
