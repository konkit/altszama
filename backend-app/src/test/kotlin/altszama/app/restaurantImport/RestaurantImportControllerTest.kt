package altszama.app.restaurantImport

import altszama.app.dish.Dish
import altszama.app.dish.DishService
import altszama.app.dish.SideDish
import altszama.app.restaurant.Restaurant
import altszama.app.restaurant.RestaurantService
import altszama.app.restaurant.dto.RestaurantSaveRequest
import altszama.app.team.TeamService
import altszama.app.test.AbstractIntegrationTest
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.MediaType
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultMatchers

class RestaurantImportControllerTest() : AbstractIntegrationTest() {

  @Autowired
  private lateinit var restaurantService: RestaurantService

  @Autowired
  private lateinit var dishService: DishService

  @Autowired
  private lateinit var teamService: TeamService

  @Autowired
  private lateinit var mockMvc: MockMvc

  private val restaurantImportJson = """{
      "name": "Restaurant 1",
      "url": "http://restaurant.com",
      "dishes": [
        { "name": "Dish 1", "price": "1,00", "sidedishes": [{"name": "Sauce 1", "price": ""}], "category": "Pizzas" },
        { "name": "Dish 2", "price": "2,00", "sidedishes": [], "category": "Pizzas" },
        { "name": "Dish 3", "price": "", "sidedishes": [], "category": "" }
      ],
      "telephone": "123 - 123 - 123",
      "address": "Privet Drive 4"
    }""".trimIndent()

  @Test
  fun shouldSuccessfullyImportNewRestaurant() {
    val team1 = teamService.createTeam("team1.com", "team1.com")

    val request = post("/api/restaurantImport/import")
        .content(restaurantImportJson)
        .contentType(MediaType.APPLICATION_JSON)
        .with(httpBasic(team1.importUsername, team1.importPassword))

    mockMvc.perform(request)
        .andExpect(MockMvcResultMatchers.status().isCreated)

    val restaurant = restaurantService.findByTeamAndName(team1, "Restaurant 1")!!

    assertThat(restaurant.name).isEqualTo("Restaurant 1")

    val dishes = dishService.findAllDishesByRestaurantId(restaurant.id)
    assertThat(dishes).hasSize(3)

    assertThat(dishes[0].name).isEqualTo("Dish 1")
    assertThat(dishes[0].price).isEqualTo(100)
    assertThat(dishes[0].sideDishes).hasSize(1)

    assertThat(dishes[2].name).isEqualTo("Dish 3")
    assertThat(dishes[2].price).isEqualTo(0)
    assertThat(dishes[2].sideDishes).hasSize(0)
  }

  @Test
  fun shouldReturnUnauthorizedResponseIfThereIsNoBasicAuthHeader() {
    val request = post("/api/restaurantImport/import")
      .content(restaurantImportJson)
      .contentType(MediaType.APPLICATION_JSON)

    expectUnauthorizedWithMessage(request, "Please use Basic Auth with credentials provided on Restaurants page")
  }

  @Test
  fun shouldUpdateTheCorrectRestaurantInTheCorrectTeam() {
    val team1 = teamService.createTeam("team1.com", "team1.com")
    val team2 = teamService.createTeam("team2.com", "team2.com")

    restaurantService.createRestaurant(team1, RestaurantSaveRequest(name = "Restaurant 1"))
    restaurantService.createRestaurant(team2, RestaurantSaveRequest(name = "Restaurant 1"))

    val request = post("/api/restaurantImport/import")
        .content(restaurantImportJson)
        .contentType(MediaType.APPLICATION_JSON)
        .with(httpBasic(team2.importUsername, team2.importPassword))

    mockMvc.perform(request)
        .andExpect(MockMvcResultMatchers.status().isCreated)

    val restaurant = restaurantService.findByTeamAndName(team2, "Restaurant 1")!!
    val dishes = dishService.findAllDishesByRestaurantId(restaurant.id)
    assertThat(dishes).hasSize(3)
  }

  @Test
  fun shouldReturnErrorIfTheLoginIsWrong() {
    val team1 = teamService.createTeam("team1.com", "team1.com")
    val team2 = teamService.createTeam("team2.com", "team1.com")

    restaurantService.createRestaurant(team1, RestaurantSaveRequest(name = "Restaurant 1"))
    restaurantService.createRestaurant(team2, RestaurantSaveRequest(name = "Restaurant 1"))

    val fakeUsername = "fakeusername"
    val fakePassword = "fakepassword"

    val request = post("/api/restaurantImport/import")
      .content(restaurantImportJson)
      .contentType(MediaType.APPLICATION_JSON)
      .with(httpBasic(fakeUsername, fakePassword))

    expectUnauthorizedWithMessage(request, "Invalid credentials")
  }

  @Test
  fun shouldReturnErrorIfThePasswordIsWrong() {
    val team1 = teamService.createTeam("team1.com", "team1.com")
    val team2 = teamService.createTeam("team2.com", "team1.com")

    restaurantService.createRestaurant(team1, RestaurantSaveRequest(name = "Restaurant 1"))
    restaurantService.createRestaurant(team2, RestaurantSaveRequest(name = "Restaurant 1"))

    val fakePassword = "fakepassword"

    val request = post("/api/restaurantImport/import")
        .content(restaurantImportJson)
        .contentType(MediaType.APPLICATION_JSON)
        .with(httpBasic(team1.importUsername, fakePassword))

    expectUnauthorizedWithMessage(request, "Invalid credentials")
  }

  @Test
  fun itShouldUpdateExistingDishesInTheRestaurant() {
    val team1 = teamService.createTeam("team1.com", "team1.com")
    val (_, user1) = createUserAndGetToken("John", "john1@team1.com")

    val (restaurant, dishes) = createRestaurantAndDishes(team1)

    val updatedDishes = dishes.map { dish -> dish.copy(category = "Updated " + dish.category, price = dish.price * 2) }

    val request = post("/api/restaurantImport/import")
      .content(createRestaurantsJson(restaurant, updatedDishes))
      .contentType(MediaType.APPLICATION_JSON)
      .with(httpBasic(team1.importUsername, team1.importPassword))

    mockMvc.perform(request)
      .andExpect(MockMvcResultMatchers.status().isCreated)

    val resultDishes = dishService.findAllDishesByRestaurantId(restaurant.id)

    assertThat(resultDishes.size).isEqualTo(updatedDishes.size)

    resultDishes.sortedBy { it.id }.zip(updatedDishes.sortedBy { it.id }).forEach { (result, expected) ->
      assertThat(result.name).isEqualTo(expected.name)
      assertThat(result.price).isEqualTo(expected.price)
      assertThat(result.category).isEqualTo(expected.category)
      assertThat(result.sideDishes).isEqualTo(expected.sideDishes)
    }
  }

  private fun createRestaurantsJson(restaurant: Restaurant, dishes: List<Dish>): String {
    fun sideDishJson(sidedish: SideDish) = """{ 
      "name": "${sidedish.name}", 
      "price": "${"%d,%02d".format(sidedish.price / 100, sidedish.price % 100)}" 
    }""".trimIndent()

    fun dishJson(dish: Dish) = """{ 
      "name": "${dish.name}", 
      "price": "${"%d,%02d".format(dish.price / 100, dish.price % 100)}", 
      "sidedishes": [${dish.sideDishes.joinToString(", ") { sd -> sideDishJson(sd) }}], 
      "category": "${dish.category}" 
    }""".trimIndent()

    return """{
      "name": "${restaurant.name}",
      "url": ": ${restaurant.url}: ",
      "dishes": [
        ${dishes.joinToString(", ") { d -> dishJson(d) }}
      ],
      "telephone": "123 - 123 - 123",
      "address": "Privet Drive 4"
    }""".trimIndent()
  }
}
