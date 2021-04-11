package altszama.app.dish

import altszama.app.restaurant.RestaurantService
import altszama.app.restaurant.dto.RestaurantSaveRequest
import altszama.app.team.TeamService
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

internal class DishControllerSaveDishTest : AbstractIntegrationTest() {

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
  private lateinit var testFactoriesService: TestFactoriesService


  @Test
  fun itShouldSaveDishSuccessfully() {
    val team1 = testFactoriesService.createTeam1()
    val (user1Token, user) = testFactoriesService.createUser1WithToken(team1)

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
    val team1 = testFactoriesService.createTeam1()
    val (user1Token, user) = testFactoriesService.createUser1WithToken(team1)

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

    expectBadRequestWithMessage(request, "Restaurant does not exist")
  }

  @Test
  fun itShouldNotSaveDishIfUserHasNoAccessToRestaurant() {
    val team1 = testFactoriesService.createTeam1()
    val (user1Token, user) = testFactoriesService.createUser1WithToken(team1)

    val team2 = testFactoriesService.createTeam2()

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

    expectBadRequestWithMessage(request, "You have no access to this restaurant")
  }

  @Test
  fun itShouldNotSaveDishIfDishNameIsBlank() {
    val team1 = testFactoriesService.createTeam1()
    val (user1Token, user) = testFactoriesService.createUser1WithToken(team1)

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

    expectBadRequestWithMessage(request, "Dish name cannot be blank")

    val dishesInRestaurant = dishService.findAllDishesByRestaurantId(restaurant.id)
    assertThat(dishesInRestaurant).hasSize(0)
  }

  @Test
  fun itShouldSaveDishWithZeroPriceIfItIsNotSet() {
    val team1 = testFactoriesService.createTeam1()
    val (user1Token, user) = testFactoriesService.createUser1WithToken(team1)

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
    val team1 = testFactoriesService.createTeam1()
    val (user1Token, user) = testFactoriesService.createUser1WithToken(team1)

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

    expectBadRequestWithMessage(request, "Dish price must not be negative")

    val dishesInRestaurant = dishService.findAllDishesByRestaurantId(restaurant.id)
    assertThat(dishesInRestaurant).hasSize(0)
  }
}
