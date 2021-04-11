package altszama.app.restaurant

import altszama.app.restaurant.dto.RestaurantSaveRequest
import altszama.app.test.AbstractIntegrationTest
import altszama.app.test.TestFactoriesService
import altszama.app.validation.NoAccessToRestaurant
import altszama.app.validation.RestaurantDoesNotExist
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers

internal class RestaurantControllerUpdateTest : AbstractIntegrationTest() {

  @Autowired
  private lateinit var mockMvc: MockMvc

  @Autowired
  private lateinit var restaurantService: RestaurantService

  @Autowired
  private lateinit var testFactoriesService: TestFactoriesService


  @Test
  fun itShouldUpdateRestaurantIfTheTeamIsCorrect() {
    val team1 = testFactoriesService.createTeam1()
    val (user1Token, user1) = testFactoriesService.createUser1WithToken(team1)

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
    val team1 = testFactoriesService.createTeam1()
    val (user1Token, user1) = testFactoriesService.createUser1WithToken(team1)

    val team2 = testFactoriesService.createTeam2()

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

    expectBadRequestWithMessage(request, RestaurantDoesNotExist().message)
  }

  @Test
  fun itShouldFailToUpdateRestaurantIfTheTeamIsWrong() {
    val team1 = testFactoriesService.createTeam1()
    val (user1Token, user1) = testFactoriesService.createUser1WithToken(team1)

    val team2 = testFactoriesService.createTeam2()

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

    expectBadRequestWithMessage(request, NoAccessToRestaurant().message)

    val updatedRestaurant = restaurantService.findById(restaurant.id).get()

    assertThat(updatedRestaurant.name).isEqualTo("Restaurant 1")
    assertThat(updatedRestaurant.address).isEqualTo("Address 1")
  }

  @Test
  fun itShouldFailToUpdateRestaurantIfTheNewNameIsBlank() {
    val team1 = testFactoriesService.createTeam1()
    val (user1Token, user1) = testFactoriesService.createUser1WithToken(team1)

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

    expectBadRequestWithMessage(request, "Restaurant name cannot be blank")

    val updatedRestaurant = restaurantService.findById(restaurant.id).get()

    assertThat(updatedRestaurant.name).isEqualTo("Restaurant 1")
    assertThat(updatedRestaurant.address).isEqualTo("Address 1")
  }

  @Test
  fun itShouldFailToUpdateRestaurantIfTheNewNameIsNotInTheData() {
    val team1 = testFactoriesService.createTeam1()
    val (user1Token, user1) = testFactoriesService.createUser1WithToken(team1)

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

    expectBadRequestWithMessage(request, "Restaurant name cannot be blank")

    val updatedRestaurant = restaurantService.findById(restaurant.id).get()

    assertThat(updatedRestaurant.name).isEqualTo("Restaurant 1")
    assertThat(updatedRestaurant.address).isEqualTo("Address 1")
  }
}
