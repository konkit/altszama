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

internal class DishControllerUpdateDishTest : AbstractIntegrationTest() {

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

    expectBadRequestWithMessage(request, "Restaurant does not exist")
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

    expectBadRequestWithMessage(request, "Dish does not exist")
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

    expectBadRequestWithMessage(request, "You have no access to this restaurant")
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

    expectBadRequestWithMessage(request, "Dish name cannot be blank")
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

    expectBadRequestWithMessage(request, "Dish price must not be negative")
  }

}
