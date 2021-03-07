package altszama.app.restaurant

import altszama.app.restaurant.dto.IndexResponse
import altszama.app.restaurant.dto.RestaurantSaveRequest
import altszama.app.team.TeamService
import altszama.app.test.AbstractIntegrationTest
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

internal class RestaurantControllerTest : AbstractIntegrationTest() {

  @Autowired
  private lateinit var mockMvc: MockMvc

  @Autowired
  private lateinit var teamService: TeamService

  @Autowired
  private lateinit var restaurantService: RestaurantService

  @Autowired
  private lateinit var objectMapper: ObjectMapper


  @Test
  fun itShouldCreateRestaurantSuccessfully() {
    val team1 = teamService.createTeam("team1.com", "", listOf("james@team1.com"))

    val restaurantCreatorToken = createUserAndGetToken("James", "james@team1.com")

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
        .header("Authorization", restaurantCreatorToken)

    mockMvc.perform(request)
        .andExpect(MockMvcResultMatchers.status().isCreated)

    val restaurant = restaurantService.findByTeamAndName(team1, "New Restaurant")

    assertThat(restaurant).isNotNull
  }

  @Test
  fun itShouldFailToCreateRestaurantWithoutName() {
    val team1 = teamService.createTeam("team1.com", "", listOf("james@team1.com"))

    val restaurantCreatorToken = createUserAndGetToken("James", "james@team1.com")

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
        .header("Authorization", restaurantCreatorToken)

    val response = mockMvc.perform(request)
        .andExpect(MockMvcResultMatchers.status().isBadRequest)
        .andReturn()
        .response.contentAsString

    assertThat(objectMapper.readTree(response)["message"].asText()).isEqualTo("Restaurant name cannot be blank")

    val restaurant = restaurantService.findByTeamAndName(team1, "New Restaurant")

    assertThat(restaurant).isNull()
  }

  @Test
  fun itShouldListRestaurantsOnlyFromMyTeam() {
    val user1Token = createUserAndGetToken("James1", "james1@team1.com")
    val user2Token = createUserAndGetToken("James1", "james1@team1.com")

    val team1 = teamService.createTeam("team1.com", "", listOf("james1@team1.com"))
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

  @Test
  fun itShouldUpdateRestaurantIfTheTeamIsCorrect() {
    val user1Token = createUserAndGetToken("James1", "james1@team1.com")

    val team1 = teamService.createTeam("team1.com", "", listOf("james1@team1.com"))

    val restaurant = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1", address = "Address 1"))

    val updateContent = """{
        "id": "${restaurant.id}",
        "name": "Restaurant 11",
        "telephone": "",
        "address": "Address 2",
        "url": ""
    }""".trimIndent()

    val request = MockMvcRequestBuilders.put("/api/restaurants/update")
        .content(updateContent)
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user1Token)

    mockMvc.perform(request)
        .andExpect(MockMvcResultMatchers.status().isOk)
        .andReturn()
        .response.contentAsString

    val updatedRestaurant = restaurantService.findById(restaurant.id).get()

    assertThat(updatedRestaurant.name).isEqualTo("Restaurant 11")
    assertThat(updatedRestaurant.address).isEqualTo("Address 2")
  }

  @Test
  fun itShouldFailToUpdateRestaurantIfItDoesNotExist() {
    val user1Token = createUserAndGetToken("James1", "james1@team1.com")

    val team1 = teamService.createTeam("team1.com", "", listOf("james1@team1.com"))
    val team2 = teamService.createTeam("team2.com", "", listOf("james2@team2.com"))

    val fakeRestaurantId = "111111111111111111111111"

    val updateContent = """{
        "id": "${fakeRestaurantId}",
        "name": "Restaurant 11",
        "telephone": "",
        "address": "Address 2",
        "url": ""
    }""".trimIndent()

    val request = MockMvcRequestBuilders.put("/api/restaurants/update")
        .content(updateContent)
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user1Token)

    val response = mockMvc.perform(request)
        .andExpect(MockMvcResultMatchers.status().isBadRequest)
        .andReturn()
        .response.contentAsString

    assertThat(objectMapper.readTree(response)["message"].asText()).isEqualTo(RestaurantDoesNotExist().message)
  }

  @Test
  fun itShouldFailToUpdateRestaurantIfTheTeamIsWrong() {
    val user1Token = createUserAndGetToken("James1", "james1@team1.com")

    val team1 = teamService.createTeam("team1.com", "", listOf("james1@team1.com"))
    val team2 = teamService.createTeam("team2.com", "", listOf("james2@team2.com"))

    val restaurant = restaurantService.createRestaurant(team2, RestaurantSaveRequest("Restaurant 1", address = "Address 1"))

    val updateContent = """{
        "id": "${restaurant.id}",
        "name": "Restaurant 11",
        "telephone": "",
        "address": "Address 2",
        "url": ""
    }""".trimIndent()

    val request = MockMvcRequestBuilders.put("/api/restaurants/update")
        .content(updateContent)
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user1Token)

    val response = mockMvc.perform(request)
        .andExpect(MockMvcResultMatchers.status().isBadRequest)
        .andReturn()
        .response.contentAsString

    assertThat(objectMapper.readTree(response)["message"].asText()).isEqualTo(NoAccessToRestaurant().message)

    val updatedRestaurant = restaurantService.findById(restaurant.id).get()

    assertThat(updatedRestaurant.name).isEqualTo("Restaurant 1")
    assertThat(updatedRestaurant.address).isEqualTo("Address 1")
  }

  @Test
  fun itShouldFailToUpdateRestaurantIfTheNewNameIsBlank() {
    val user1Token = createUserAndGetToken("James1", "james1@team1.com")

    val team1 = teamService.createTeam("team1.com", "", listOf("james1@team1.com"))

    val restaurant = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1", address = "Address 1"))

    val updateContent = """{
        "id": "${restaurant.id}",
        "name": "",
        "telephone": "",
        "address": "Address 2",
        "url": ""
    }""".trimIndent()

    val request = MockMvcRequestBuilders.put("/api/restaurants/update")
        .content(updateContent)
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user1Token)

    val response = mockMvc.perform(request)
        .andExpect(MockMvcResultMatchers.status().isBadRequest)
        .andReturn()
        .response.contentAsString

    assertThat(objectMapper.readTree(response)["message"].asText()).isEqualTo("Restaurant name cannot be blank")

    val updatedRestaurant = restaurantService.findById(restaurant.id).get()

    assertThat(updatedRestaurant.name).isEqualTo("Restaurant 1")
    assertThat(updatedRestaurant.address).isEqualTo("Address 1")
  }

  @Test
  fun itShouldFailToUpdateRestaurantIfTheNewNameIsNotInTheData() {
    val user1Token = createUserAndGetToken("James1", "james1@team1.com")

    val team1 = teamService.createTeam("team1.com", "", listOf("james1@team1.com"))

    val restaurant = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1", address = "Address 1"))

    val updateContent = """{
        "id": "${restaurant.id}",
        "telephone": "",
        "address": "Address 2",
        "url": ""
    }""".trimIndent()

    val request = MockMvcRequestBuilders.put("/api/restaurants/update")
        .content(updateContent)
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user1Token)

    val response = mockMvc.perform(request)
        .andExpect(MockMvcResultMatchers.status().isBadRequest)
        .andReturn()
        .response.contentAsString

    assertThat(objectMapper.readTree(response)["message"].asText()).isEqualTo("Restaurant name cannot be blank")

    val updatedRestaurant = restaurantService.findById(restaurant.id).get()

    assertThat(updatedRestaurant.name).isEqualTo("Restaurant 1")
    assertThat(updatedRestaurant.address).isEqualTo("Address 1")
  }

  @Test
  fun itShouldDeleteRestaurantIfTheTeamIsCorrect() {
    val user1Token = createUserAndGetToken("James1", "james1@team1.com")

    val team1 = teamService.createTeam("team1.com", "", listOf("james1@team1.com"))

    val restaurant = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1", address = "Address 1"))

    val request = MockMvcRequestBuilders.delete("/api/restaurants/${restaurant.id}/delete")
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user1Token)

    mockMvc.perform(request)
        .andExpect(MockMvcResultMatchers.status().isOk)
        .andReturn()
        .response.contentAsString

    val deletedRestaurantOpt = restaurantService.findById(restaurant.id)

    assertThat(deletedRestaurantOpt).isEmpty
  }

  @Test
  fun itShouldFailToDeleteRestaurantIfItDoesNotExist() {
    val user1Token = createUserAndGetToken("James1", "james1@team1.com")

    val team1 = teamService.createTeam("team1.com", "", listOf("james1@team1.com"))
    val team2 = teamService.createTeam("team2.com", "", listOf("james2@team2.com"))

    val fakeRestaurantId = "111111111111111111111111"

    val request = MockMvcRequestBuilders.delete("/api/restaurants/${fakeRestaurantId}/delete")
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user1Token)

    val response = mockMvc.perform(request)
        .andExpect(MockMvcResultMatchers.status().isBadRequest)
        .andReturn()
        .response.contentAsString

    assertThat(objectMapper.readTree(response)["message"].asText()).isEqualTo(RestaurantDoesNotExist().message)
  }

  @Test
  fun itShouldFailToDeleteRestaurantIfTheTeamIsWrong() {
    val user1Token = createUserAndGetToken("James1", "james1@team1.com")

    val team1 = teamService.createTeam("team1.com", "", listOf("james1@team1.com"))
    val team2 = teamService.createTeam("team2.com", "", listOf("james2@team2.com"))

    val restaurant = restaurantService.createRestaurant(team2, RestaurantSaveRequest("Restaurant 1", address = "Address 1"))

    val request = MockMvcRequestBuilders.delete("/api/restaurants/${restaurant.id}/delete")
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user1Token)

    val response = mockMvc.perform(request)
        .andExpect(MockMvcResultMatchers.status().isBadRequest)
        .andReturn()
        .response.contentAsString

    assertThat(objectMapper.readTree(response)["message"].asText()).isEqualTo(NoAccessToRestaurant().message)

    val deletedRestaurantOpt = restaurantService.findById(restaurant.id)

    assertThat(deletedRestaurantOpt).isNotEmpty
  }
}
