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

internal class DishControllerTest : AbstractIntegrationTest() {

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

  // Create Dish Data

  @Test
  fun itShouldReturnCreateDishDataSuccessfully() {
    val user1Token = createUserAndGetToken("James1", "james1@team1.com")

    val team1 = teamService.createTeam("team1.com", "", listOf("james1@team1.com"))

    val restaurant = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1", address = "Address 1"))

    val dish1 = dishService.saveDish(team1, restaurant.id, DishCreateRequest("Dish 1", 100, category = "Category 1"))

    val request = MockMvcRequestBuilders.get("/api/restaurants/${restaurant.id}/dishes/create.json")
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user1Token)

    val response = mockMvc.perform(request)
        .andExpect(MockMvcResultMatchers.status().isOk)
        .andReturn()
        .response.contentAsString

    assertThat(objectMapper.readTree(response)["categories"].asIterable().map { x -> x.asText()})
        .hasSameElementsAs(listOf("Category 1"))
  }

  @Test
  fun itShouldNotReturnCreateDishDataIfRestaurantDoesNotExist() {
    val user1Token = createUserAndGetToken("James1", "james1@team1.com")
    val team1 = teamService.createTeam("team1.com", "", listOf("james1@team1.com"))

    val fakeRestaurantId = "111111111111111111111111"

    val request = MockMvcRequestBuilders.get("/api/restaurants/${fakeRestaurantId}/dishes/create.json")
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user1Token)

    val response = mockMvc.perform(request)
        .andExpect(MockMvcResultMatchers.status().isBadRequest)
        .andReturn()
        .response.contentAsString

    assertThat(objectMapper.readTree(response)["message"].asText()).isEqualTo("Restaurant does not exist")
  }

  @Test
  fun itShouldNotReturnCreateDishDataIfUserHasNoAccessToRestaurant() {
    val user1Token = createUserAndGetToken("James1", "james1@team1.com")

    val team1 = teamService.createTeam("team1.com", "", listOf("james1@team1.com"))
    val team2 = teamService.createTeam("team2.com", "", listOf("james2@team2.com"))

    val restaurant = restaurantService.createRestaurant(team2, RestaurantSaveRequest("Restaurant 1", address = "Address 1"))

    val dish1 = dishService.saveDish(team2, restaurant.id, DishCreateRequest("Dish 1", 100, category = "Category 1"))

    val request = MockMvcRequestBuilders.get("/api/restaurants/${restaurant.id}/dishes/create.json")
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user1Token)

    val response = mockMvc.perform(request)
        .andExpect(MockMvcResultMatchers.status().isBadRequest)
        .andReturn()
        .response.contentAsString

    assertThat(objectMapper.readTree(response)["message"].asText()).isEqualTo("You have no access to this restaurant")
  }

  // Save Dish

  @Test
  fun itShouldSaveDishSuccessfully() {
    val user1Token = createUserAndGetToken("James1", "james1@team1.com")

    val team1 = teamService.createTeam("team1.com", "", listOf("james1@team1.com"))

    val restaurant = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1", address = "Address 1"))

    val createContent = """{
        "name": "Dish 1",
        "price": "300",
        "sideDishes": [
          {"name": "Side dish 1", "price": 100},
          {"name": "Side dish 2", "price": 200}
        ],
        "category": "Category 1"
    }""".trimIndent()

    val request = MockMvcRequestBuilders.post("/api/restaurants/${restaurant.id}/dishes/save")
        .content(createContent)
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user1Token)

    mockMvc.perform(request)
        .andExpect(MockMvcResultMatchers.status().isCreated)

    val dishesInRestaurant = dishService.findAllDishesByRestaurantId(restaurant.id)
    assertThat(dishesInRestaurant).hasSize(1)
    assertThat(dishesInRestaurant[0].name).isEqualTo("Dish 1")
    assertThat(dishesInRestaurant[0].price).isEqualTo(300)
    assertThat(dishesInRestaurant[0].sideDishes).hasSize(2)
    assertThat(dishesInRestaurant[0].category).isEqualTo("Category 1")
  }

  @Test
  fun itShouldNotSaveDishIfRestaurantDoesNotExist() {
    val user1Token = createUserAndGetToken("James1", "james1@team1.com")
    val team1 = teamService.createTeam("team1.com", "", listOf("james1@team1.com"))

    val fakeRestaurantId = "111111111111111111111111"

    val createContent = """{
        "name": "Dish 1",
        "price": "300",
        "sideDishes": [
          {"name": "Side dish 1", "price": 100},
          {"name": "Side dish 2", "price": 200}
        ],
        "category": "Category 1"
    }""".trimIndent()

    val request = MockMvcRequestBuilders.post("/api/restaurants/${fakeRestaurantId}/dishes/save")
        .content(createContent)
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user1Token)

    val response = mockMvc.perform(request)
        .andExpect(MockMvcResultMatchers.status().isBadRequest)
        .andReturn()
        .response.contentAsString

    assertThat(objectMapper.readTree(response)["message"].asText()).isEqualTo("Restaurant does not exist")
  }

  @Test
  fun itShouldNotSaveDishIfUserHasNoAccessToRestaurant() {
    val user1Token = createUserAndGetToken("James1", "james1@team1.com")

    val team1 = teamService.createTeam("team1.com", "", listOf("james1@team1.com"))
    val team2 = teamService.createTeam("team2.com", "", listOf("james2@team2.com"))

    val restaurant = restaurantService.createRestaurant(team2, RestaurantSaveRequest("Restaurant 1", address = "Address 1"))

    val createContent = """{
        "name": "Dish 1",
        "price": "300",
        "sideDishes": [
          {"name": "Side dish 1", "price": 100},
          {"name": "Side dish 2", "price": 200}
        ],
        "category": "Category 1"
    }""".trimIndent()

    val request = MockMvcRequestBuilders.post("/api/restaurants/${restaurant.id}/dishes/save")
        .content(createContent)
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user1Token)

    val response = mockMvc.perform(request)
        .andExpect(MockMvcResultMatchers.status().isBadRequest)
        .andReturn()
        .response.contentAsString

    assertThat(objectMapper.readTree(response)["message"].asText()).isEqualTo("You have no access to this restaurant")
  }

  @Test
  fun itShouldNotSaveDishIfDishNameIsBlank() {
    val user1Token = createUserAndGetToken("James1", "james1@team1.com")

    val team1 = teamService.createTeam("team1.com", "", listOf("james1@team1.com"))

    val restaurant = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1", address = "Address 1"))

    val createContent = """{
        "name": "",
        "price": "300",
        "sideDishes": [
          {"name": "Side dish 1", "price": 100},
          {"name": "Side dish 2", "price": 200}
        ],
        "category": "Category 1"
    }""".trimIndent()

    val request = MockMvcRequestBuilders.post("/api/restaurants/${restaurant.id}/dishes/save")
        .content(createContent)
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user1Token)

    val response = mockMvc.perform(request)
        .andExpect(MockMvcResultMatchers.status().isBadRequest)
        .andReturn()
        .response.contentAsString

    assertThat(objectMapper.readTree(response)["message"].asText()).isEqualTo("Dish name cannot be blank")

    val dishesInRestaurant = dishService.findAllDishesByRestaurantId(restaurant.id)
    assertThat(dishesInRestaurant).hasSize(0)
  }

  @Test
  fun itShouldSaveDishWithZeroPriceIfItIsNotSet() {
    val user1Token = createUserAndGetToken("James1", "james1@team1.com")

    val team1 = teamService.createTeam("team1.com", "", listOf("james1@team1.com"))

    val restaurant = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1", address = "Address 1"))

    val createContent = """{
        "name": "Dish 1",
        "sideDishes": [
          {"name": "Side dish 1", "price": 100},
          {"name": "Side dish 2", "price": 200}
        ],
        "category": "Category 1"
    }""".trimIndent()

    val request = MockMvcRequestBuilders.post("/api/restaurants/${restaurant.id}/dishes/save")
        .content(createContent)
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user1Token)

    val response = mockMvc.perform(request)
        .andExpect(MockMvcResultMatchers.status().isCreated)
        .andReturn()
        .response.contentAsString

    val dishesInRestaurant = dishService.findAllDishesByRestaurantId(restaurant.id)
    assertThat(dishesInRestaurant).hasSize(1)
    assertThat(dishesInRestaurant[0].price).isEqualTo(0)
  }

  @Test
  fun itShouldNotSaveDishIfDishPriceIsNegative() {
    val user1Token = createUserAndGetToken("James1", "james1@team1.com")

    val team1 = teamService.createTeam("team1.com", "", listOf("james1@team1.com"))

    val restaurant = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1", address = "Address 1"))

    val createContent = """{
        "name": "Dish 1",
        "price": -100,
        "sideDishes": [
          {"name": "Side dish 1", "price": 100},
          {"name": "Side dish 2", "price": 200}
        ],
        "category": "Category 1"
    }""".trimIndent()

    val request = MockMvcRequestBuilders.post("/api/restaurants/${restaurant.id}/dishes/save")
        .content(createContent)
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user1Token)

    val response = mockMvc.perform(request)
        .andExpect(MockMvcResultMatchers.status().isBadRequest)
        .andReturn()
        .response.contentAsString

    assertThat(objectMapper.readTree(response)["message"].asText()).isEqualTo("Dish price must not be negative")

    val dishesInRestaurant = dishService.findAllDishesByRestaurantId(restaurant.id)
    assertThat(dishesInRestaurant).hasSize(0)
  }

  // Edit Dish Data

  @Test
  fun itShouldReturnEditDishDataSuccessfully() {
    val user1Token = createUserAndGetToken("James1", "james1@team1.com")

    val team1 = teamService.createTeam("team1.com", "", listOf("james1@team1.com"))

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
    val user1Token = createUserAndGetToken("James1", "james1@team1.com")

    val team1 = teamService.createTeam("team1.com", "", listOf("james1@team1.com"))

    val fakeRestaurantId = "111111111111111111111111"
    val fakeDishId = "111111111111111111111112"

    val request = MockMvcRequestBuilders.get("/api/restaurants/${fakeRestaurantId}/dishes/${fakeDishId}/edit.json")
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user1Token)

    val response = mockMvc.perform(request)
        .andExpect(MockMvcResultMatchers.status().isBadRequest)
        .andReturn()
        .response.contentAsString

    assertThat(objectMapper.readTree(response)["message"].asText()).isEqualTo("Restaurant does not exist")
  }

  @Test
  fun itShouldNotReturnEditDishDataIfDishDoesNotExist() {
    val user1Token = createUserAndGetToken("James1", "james1@team1.com")

    val team1 = teamService.createTeam("team1.com", "", listOf("james1@team1.com"))

    val restaurant = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1", address = "Address 1"))

    val fakeDishId = "111111111111111111111112"

    val request = MockMvcRequestBuilders.get("/api/restaurants/${restaurant.id}/dishes/${fakeDishId}/edit.json")
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user1Token)

    val response = mockMvc.perform(request)
        .andExpect(MockMvcResultMatchers.status().isBadRequest)
        .andReturn()
        .response.contentAsString

    assertThat(objectMapper.readTree(response)["message"].asText()).isEqualTo("Dish does not exist")
  }

  @Test
  fun itShouldNotReturnEditDishDataIfUserHasNoAccessToRestaurant() {
    val user1Token = createUserAndGetToken("James1", "james1@team1.com")

    val team1 = teamService.createTeam("team1.com", "", listOf("james1@team1.com"))
    val team2 = teamService.createTeam("team2.com", "", listOf("james2@team2.com"))

    val restaurant = restaurantService.createRestaurant(team2, RestaurantSaveRequest("Restaurant 1", address = "Address 1"))

    val dish1 = dishService.saveDish(team2, restaurant.id, DishCreateRequest("Dish 1", 100, category = "Category 1"))

    val request = MockMvcRequestBuilders.get("/api/restaurants/${restaurant.id}/dishes/${dish1.id}/edit.json")
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user1Token)

    val response = mockMvc.perform(request)
        .andExpect(MockMvcResultMatchers.status().isBadRequest)
        .andReturn()
        .response.contentAsString

    assertThat(objectMapper.readTree(response)["message"].asText()).isEqualTo("You have no access to this restaurant")
  }

  // Update Dish

  @Test
  fun itShouldUpdateDishSuccessfully() {
    val user1Token = createUserAndGetToken("James1", "james1@team1.com")

    val team1 = teamService.createTeam("team1.com", "", listOf("james1@team1.com"))

    val restaurant = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1", address = "Address 1"))
    val dish1 = dishService.saveDish(team1, restaurant.id, DishCreateRequest("Dish 1", 100, category = "Category 1"))

    val updateContent = """{
        "id": "${dish1.id}",
        "name": "Dish 1",
        "price": "300",
        "sideDishes": [
          {"name": "Side dish 1", "price": 100},
          {"name": "Side dish 2", "price": 200}
        ],
        "category": "Category 1"
    }""".trimIndent()

    val request = MockMvcRequestBuilders.put("/api/restaurants/${restaurant.id}/dishes/update")
        .content(updateContent)
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user1Token)

    mockMvc.perform(request)
        .andExpect(MockMvcResultMatchers.status().isOk)

    val dishesInRestaurant = dishService.findAllDishesByRestaurantId(restaurant.id)
    assertThat(dishesInRestaurant).hasSize(1)
    assertThat(dishesInRestaurant[0].name).isEqualTo("Dish 1")
    assertThat(dishesInRestaurant[0].price).isEqualTo(300)
    assertThat(dishesInRestaurant[0].sideDishes).hasSize(2)
    assertThat(dishesInRestaurant[0].category).isEqualTo("Category 1")
  }

  @Test
  fun itShouldNotUpdateDishIfRestaurantDoesNotExist() {
    val user1Token = createUserAndGetToken("James1", "james1@team1.com")

    val team1 = teamService.createTeam("team1.com", "", listOf("james1@team1.com"))

    val fakeRestaurantId = "111111111111111111111111"
    val fakeDishIdR = "111111111111111111111112"

    val updateContent = """{
        "id": "${fakeDishIdR}",
        "name": "Dish 1",
        "price": "300",
        "sideDishes": [
          {"name": "Side dish 1", "price": 100},
          {"name": "Side dish 2", "price": 200}
        ],
        "category": "Category 1"
    }""".trimIndent()

    val request = MockMvcRequestBuilders.put("/api/restaurants/${fakeRestaurantId}/dishes/update")
        .content(updateContent)
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user1Token)

    val response = mockMvc.perform(request)
        .andExpect(MockMvcResultMatchers.status().isBadRequest)
        .andReturn().response.contentAsString

    assertThat(objectMapper.readTree(response)["message"].asText()).isEqualTo("Restaurant does not exist")
  }

  @Test
  fun itShouldNotUpdateDishIfDishDoesNotExist() {
    val user1Token = createUserAndGetToken("James1", "james1@team1.com")

    val team1 = teamService.createTeam("team1.com", "", listOf("james1@team1.com"))

    val restaurant = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1", address = "Address 1"))
    val fakeDishIdR = "111111111111111111111112"

    val updateContent = """{
        "id": "${fakeDishIdR}",
        "name": "Dish 1",
        "price": "300",
        "sideDishes": [
          {"name": "Side dish 1", "price": 100},
          {"name": "Side dish 2", "price": 200}
        ],
        "category": "Category 1"
    }""".trimIndent()

    val request = MockMvcRequestBuilders.put("/api/restaurants/${restaurant.id}/dishes/update")
        .content(updateContent)
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user1Token)

    val response = mockMvc.perform(request)
        .andExpect(MockMvcResultMatchers.status().isBadRequest)
        .andReturn().response.contentAsString

    assertThat(objectMapper.readTree(response)["message"].asText()).isEqualTo("Dish does not exist")
  }

  @Test
  fun itShouldNotUpdateDishIfUserHasNoAccessToRestaurant() {
    val user1Token = createUserAndGetToken("James1", "james1@team1.com")

    val team1 = teamService.createTeam("team1.com", "", listOf("james1@team1.com"))
    val team2 = teamService.createTeam("team2.com", "", listOf("james2@team2.com"))

    val restaurant = restaurantService.createRestaurant(team2, RestaurantSaveRequest("Restaurant 1", address = "Address 1"))
    val dish1 = dishService.saveDish(team2, restaurant.id, DishCreateRequest("Dish 1", 100, category = "Category 1"))

    val updateContent = """{
        "id": "${dish1.id}",
        "name": "Dish 1",
        "price": "300",
        "sideDishes": [
          {"name": "Side dish 1", "price": 100},
          {"name": "Side dish 2", "price": 200}
        ],
        "category": "Category 1"
    }""".trimIndent()

    val request = MockMvcRequestBuilders.put("/api/restaurants/${restaurant.id}/dishes/update")
        .content(updateContent)
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user1Token)

    val response = mockMvc.perform(request)
        .andExpect(MockMvcResultMatchers.status().isBadRequest)
        .andReturn().response.contentAsString

    assertThat(objectMapper.readTree(response)["message"].asText()).isEqualTo("You have no access to this restaurant")
  }

  @Test
  fun itShouldNotUpdateDishIfTheNewNameIsBlank() {
    val user1Token = createUserAndGetToken("James1", "james1@team1.com")

    val team1 = teamService.createTeam("team1.com", "", listOf("james1@team1.com"))

    val restaurant = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1", address = "Address 1"))
    val dish1 = dishService.saveDish(team1, restaurant.id, DishCreateRequest("Dish 1", 100, category = "Category 1"))

    val updateContent = """{
        "id": "${dish1.id}",
        "name": "",
        "price": "300",
        "sideDishes": [
          {"name": "Side dish 1", "price": 100},
          {"name": "Side dish 2", "price": 200}
        ],
        "category": "Category 1"
    }""".trimIndent()

    val request = MockMvcRequestBuilders.put("/api/restaurants/${restaurant.id}/dishes/update")
        .content(updateContent)
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user1Token)

    val response = mockMvc.perform(request)
        .andExpect(MockMvcResultMatchers.status().isBadRequest)
        .andReturn().response.contentAsString

    assertThat(objectMapper.readTree(response)["message"].asText()).isEqualTo("Dish name cannot be blank")
  }

  @Test
  fun itShouldNotUpdateDishIfTheNewNamePriceIsNegative() {
    val user1Token = createUserAndGetToken("James1", "james1@team1.com")

    val team1 = teamService.createTeam("team1.com", "", listOf("james1@team1.com"))

    val restaurant = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1", address = "Address 1"))
    val dish1 = dishService.saveDish(team1, restaurant.id, DishCreateRequest("Dish 1", 100, category = "Category 1"))

    val updateContent = """{
        "id": "${dish1.id}",
        "name": "Dish name 1",
        "price": "-300",
        "sideDishes": [
          {"name": "Side dish 1", "price": 100},
          {"name": "Side dish 2", "price": 200}
        ],
        "category": "Category 1"
    }""".trimIndent()

    val request = MockMvcRequestBuilders.put("/api/restaurants/${restaurant.id}/dishes/update")
        .content(updateContent)
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user1Token)

    val response = mockMvc.perform(request)
        .andExpect(MockMvcResultMatchers.status().isBadRequest)
        .andReturn().response.contentAsString

    assertThat(objectMapper.readTree(response)["message"].asText()).isEqualTo("Dish price must not be negative")
  }

  // Delete dish

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

    assertThat(objectMapper.readTree(response)["message"].asText()).isEqualTo("Delete failed - there are order entries using this dish")
  }


  // Delete sidedish

  @Test
  fun itShouldDeleteSideishSuccessfully() {
    val user1Token = createUserAndGetToken("James1", "james1@team1.com")

    val team1 = teamService.createTeam("team1.com", "", listOf("james1@team1.com"))

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
    val user1Token = createUserAndGetToken("James1", "james1@team1.com")

    val team1 = teamService.createTeam("team1.com", "", listOf("james1@team1.com"))

    val restaurant = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1", address = "Address 1"))
    val dishCreateRequest = DishCreateRequest("Dish 1", 100, category = "Category 1", sideDishes = emptyList())
    val dish1 = dishService.saveDish(team1, restaurant.id, dishCreateRequest)

    val fakeSideDishId = "111111111111111111111111"

    val request = MockMvcRequestBuilders.delete("/api/dishes/${dish1.id}/side_dishes/${fakeSideDishId}/delete")
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user1Token)

    val response = mockMvc.perform(request)
        .andExpect(MockMvcResultMatchers.status().isBadRequest)
        .andReturn()
        .response.contentAsString

    assertThat(objectMapper.readTree(response)["message"].asText()).isEqualTo("Side dish does not exist")
  }

  @Test
  fun itShouldNotDeleteSideishIfTheDishDoesNotExist() {
    val user1Token = createUserAndGetToken("James1", "james1@team1.com")

    val team1 = teamService.createTeam("team1.com", "", listOf("james1@team1.com"))

    val restaurant = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1", address = "Address 1"))

    val fakeDishId = "111111111111111111111111"
    val fakeSideDishId = "111111111111111111111112"

    val request = MockMvcRequestBuilders.delete("/api/dishes/${fakeDishId}/side_dishes/${fakeSideDishId}/delete")
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user1Token)

    val response = mockMvc.perform(request)
        .andExpect(MockMvcResultMatchers.status().isBadRequest)
        .andReturn()
        .response.contentAsString

    assertThat(objectMapper.readTree(response)["message"].asText()).isEqualTo("Dish does not exist")
  }

  @Test
  fun itShouldNotDeleteSideishIfUserHasNoAccessToRestaurant() {
    val user1Token = createUserAndGetToken("James1", "james1@team1.com")

    val team1 = teamService.createTeam("team1.com", "", listOf("james1@team1.com"))
    val team2 = teamService.createTeam("team2.com", "", listOf("james2@team2.com"))

    val restaurant = restaurantService.createRestaurant(team2, RestaurantSaveRequest("Restaurant 1", address = "Address 1"))
    val dishCreateRequest = DishCreateRequest("Dish 1", 100, category = "Category 1", sideDishes = listOf(SideDish(name = "Side dish 1", price = 100)))
    val dish1 = dishService.saveDish(team2, restaurant.id, dishCreateRequest)

    val createdSideDish = dish1.sideDishes.first()

    val request = MockMvcRequestBuilders.delete("/api/dishes/${dish1.id}/side_dishes/${createdSideDish.id}/delete")
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user1Token)

    val response = mockMvc.perform(request)
        .andExpect(MockMvcResultMatchers.status().isBadRequest)
        .andReturn()
        .response.contentAsString

    assertThat(objectMapper.readTree(response)["message"].asText()).isEqualTo("You have no access to this restaurant")
  }

  @Test
  fun itShouldNotDeleteSidedishIfItIsIsUse() {
    val user1Token = createUserAndGetToken("James1", "james1@team1.com")
    val user1 = userService.findByEmail("james1@team1.com").get()

    val team1 = teamService.createTeam("team1.com", "", listOf("james1@team1.com"))

    val restaurant = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1", address = "Address 1"))
    val dishCreateRequest = DishCreateRequest("Dish 1", 100, category = "Category 1", sideDishes = listOf(SideDish(name = "Side dish 1", price = 100)))
    val dish1 = dishService.saveDish(team1, restaurant.id, dishCreateRequest)

    val createdSideDish = dish1.sideDishes.first()

    val orderSaveRequest = OrderSaveRequest(restaurantId = restaurant.id, teamId = team1.id, orderDate = LocalDate.now(), timeOfOrder = LocalTime.of(14, 0), deliveryData = DeliveryData(), paymentData = PaymentData())
    val order = orderService.saveOrder(orderSaveRequest, currentUser = user1)

    val orderEntrySaveRequest = OrderEntrySaveRequest(orderId = order.id, dishId = dish1.id, newDish = false, newDishName = null, newDishPrice = null, sideDishes = listOf(SideDishData(id = createdSideDish.id, isNew = null, newSideDishName = null, newSideDishPrice = null)))
    val orderEntry = orderEntryService.saveEntry(user1, orderEntrySaveRequest)

    val request = MockMvcRequestBuilders.delete("/api/dishes/${dish1.id}/side_dishes/${createdSideDish.id}/delete")
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user1Token)

    val response = mockMvc.perform(request)
        .andExpect(MockMvcResultMatchers.status().isBadRequest)
        .andReturn()
        .response.contentAsString

    assertThat(objectMapper.readTree(response)["message"].asText()).isEqualTo("Delete failed - there are order entries using this side dish")
  }


}
