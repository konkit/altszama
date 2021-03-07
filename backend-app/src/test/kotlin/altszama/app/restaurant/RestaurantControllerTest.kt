package altszama.app.restaurant

import altszama.app.auth.UserService
import altszama.app.dish.DishService
import altszama.app.dish.dto.DishCreateRequest
import altszama.app.order.OrderService
import altszama.app.order.dto.DeliveryData
import altszama.app.order.dto.OrderSaveRequest
import altszama.app.order.dto.PaymentData
import altszama.app.orderEntry.OrderEntryService
import altszama.app.orderEntry.dto.OrderEntrySaveRequest
import altszama.app.orderEntry.dto.SideDishData
import altszama.app.restaurant.dto.IndexResponse
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

internal class RestaurantControllerTest : AbstractIntegrationTest() {

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
  fun itShouldShowRestaurantSuccessfully() {
    val user1Token = createUserAndGetToken("James1", "james1@team1.com")

    val team1 = teamService.createTeam("team1.com", "", listOf("james1@team1.com"))

    val restaurant = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1"))

    val request = MockMvcRequestBuilders.get("/api/restaurants/${restaurant.id}/show.json")
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user1Token)

    val response = mockMvc.perform(request)
        .andExpect(MockMvcResultMatchers.status().isOk)
        .andReturn()
        .response.contentAsString

    val showResponse = objectMapper.readTree(response)

    assertThat(showResponse["restaurant"]["name"].asText()).isEqualTo("Restaurant 1")
  }

  @Test
  fun itShouldNotShowRestaurantIfUserHasNoAccessToIt() {
    val user1Token = createUserAndGetToken("James1", "james1@team1.com")

    val team1 = teamService.createTeam("team1.com", "", listOf("james1@team1.com"))
    val team2 = teamService.createTeam("team2.com", "", listOf("james2@team2.com"))

    val restaurant = restaurantService.createRestaurant(team2, RestaurantSaveRequest("Restaurant 1"))

    val request = MockMvcRequestBuilders.get("/api/restaurants/${restaurant.id}/show.json")
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user1Token)

    val response = mockMvc.perform(request)
        .andExpect(MockMvcResultMatchers.status().isBadRequest)
        .andReturn()
        .response.contentAsString

    assertThat(objectMapper.readTree(response)["message"].asText()).isEqualTo(NoAccessToRestaurant().message)
  }

  @Test
  fun itShouldShowEditRestaurantResponseSuccessfully() {
    val user1Token = createUserAndGetToken("James1", "james1@team1.com")

    val team1 = teamService.createTeam("team1.com", "", listOf("james1@team1.com"))

    val restaurant = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1"))

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
    val user1Token = createUserAndGetToken("James1", "james1@team1.com")
    val team1 = teamService.createTeam("team1.com", "", listOf("james1@team1.com"))

    val fakeRestaurantId = "111111111111111111111111"

    val request = MockMvcRequestBuilders.get("/api/restaurants/${fakeRestaurantId}/edit.json")
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user1Token)

    val response = mockMvc.perform(request)
        .andExpect(MockMvcResultMatchers.status().isBadRequest)
        .andReturn()
        .response.contentAsString

    assertThat(objectMapper.readTree(response)["message"].asText()).isEqualTo(RestaurantDoesNotExist().message)
  }

  @Test
  fun itShouldNotShowEditRestaurantResponseIfUserHasNoAccessToRestaurant() {
    val user1Token = createUserAndGetToken("James1", "james1@team1.com")

    val team1 = teamService.createTeam("team1.com", "", listOf("james1@team1.com"))
    val team2 = teamService.createTeam("team2.com", "", listOf("james2@team2.com"))

    val restaurant = restaurantService.createRestaurant(team2, RestaurantSaveRequest("Restaurant 1"))

    val request = MockMvcRequestBuilders.get("/api/restaurants/${restaurant.id}/edit.json")
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user1Token)

    val response = mockMvc.perform(request)
        .andExpect(MockMvcResultMatchers.status().isBadRequest)
        .andReturn()
        .response.contentAsString

    assertThat(objectMapper.readTree(response)["message"].asText()).isEqualTo(NoAccessToRestaurant().message)
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
  fun itShouldDeleteRestaurantSuccessfully() {
    val user1Token = createUserAndGetToken("James1", "james1@team1.com")

    val team1 = teamService.createTeam("team1.com", "", listOf("james1@team1.com"))

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

  @Test
  fun itShouldFailToDeleteRestaurantIfItIsInUse() {
    val user1Token = createUserAndGetToken("James1", "james1@team1.com")
    val user1 = userService.findByEmail("james1@team1.com").get()

    val team1 = teamService.createTeam("team1.com", "", listOf("james1@team1.com"))

    val restaurant = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1", address = "Address 1"))
    val dishCreateRequest = DishCreateRequest("Dish 1", 100, category = "Category 1", sideDishes = emptyList())
    val dish1 = dishService.saveDish(team1, restaurant.id, dishCreateRequest)

    val orderSaveRequest = OrderSaveRequest(restaurantId = restaurant.id, teamId = team1.id, orderDate = LocalDate.now(), timeOfOrder = LocalTime.of(14, 0), deliveryData = DeliveryData(), paymentData = PaymentData())
    val order = orderService.saveOrder(orderSaveRequest, currentUser = user1)

    val orderEntrySaveRequest = OrderEntrySaveRequest(orderId = order.id, dishId = dish1.id, newDish = false, newDishName = null, newDishPrice = null)
    val orderEntry = orderEntryService.saveEntry(user1, orderEntrySaveRequest)

    val request = MockMvcRequestBuilders.delete("/api/restaurants/${restaurant.id}/delete")
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user1Token)

    val response = mockMvc.perform(request)
        .andExpect(MockMvcResultMatchers.status().isBadRequest)
        .andReturn()
        .response.contentAsString

    assertThat(objectMapper.readTree(response)["message"].asText()).isEqualTo(RestaurantInUseException().message)
  }
}
