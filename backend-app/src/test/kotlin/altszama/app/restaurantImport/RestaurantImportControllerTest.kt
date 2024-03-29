package altszama.app.restaurantImport

import altszama.app.dish.Dish
import altszama.app.dish.DishService
import altszama.app.dish.SideDish
import altszama.app.dish.dto.DishCreateRequest
import altszama.app.restaurant.Restaurant
import altszama.app.restaurant.RestaurantService
import altszama.app.restaurant.dto.RestaurantSaveRequest
import altszama.app.team.Team
import altszama.app.test.AbstractIntegrationTest
import altszama.app.test.TestFactoriesService
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultMatchers

class RestaurantImportControllerTest() : AbstractIntegrationTest() {

  @Autowired
  private lateinit var restaurantService: RestaurantService

  @Autowired
  private lateinit var dishService: DishService

  @Autowired
  private lateinit var mockMvc: MockMvc

  @Autowired
  private lateinit var testFactoriesService: TestFactoriesService

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
  fun shouldSuccessfullyImportCompletelyNewRestaurant() {
    val team1 = testFactoriesService.createTeam1()

    val request = post("/api/restaurantImport/import")
      .content(restaurantImportJson)
      .contentType(MediaType.APPLICATION_JSON)
      .header(RestaurantImport.headerName, team1.importApiKey)

    mockMvc.perform(request)
      .andExpect(MockMvcResultMatchers.status().isOk)

    val restaurant = restaurantService.findByTeamAndName(team1, "Restaurant 1")!!
    assertThat(restaurant.name).isEqualTo("Restaurant 1")

    val dishes = dishService.findAllDishesByRestaurantId(restaurant.id)
    assertThat(dishes).hasSize(3)

    assertThat(dishes[0].name).isEqualTo("Dish 1")
    assertThat(dishes[0].price).isEqualTo(100)
    assertThat(dishes[0].sideDishes).hasSize(1)

    assertThat(dishes[1].name).isEqualTo("Dish 2")
    assertThat(dishes[1].price).isEqualTo(200)
    assertThat(dishes[1].sideDishes).hasSize(0)

    assertThat(dishes[2].name).isEqualTo("Dish 3")
    assertThat(dishes[2].price).isEqualTo(0)
    assertThat(dishes[2].sideDishes).hasSize(0)
  }

  @Test
  fun shouldReturnUnauthorizedResponseIfThereIsNoBasicAuthHeader() {
    val request = post("/api/restaurantImport/import")
      .content(restaurantImportJson)
      .contentType(MediaType.APPLICATION_JSON)

    expectUnauthorizedWithMessage(request, "Please use API Key provided on Restaurants page")
  }

  @Test
  fun shouldUpdateTheCorrectRestaurantInTheCorrectTeam() {
    val team1 = testFactoriesService.createTeam1()
    val team2 = testFactoriesService.createTeam2()

    restaurantService.createRestaurant(team1, RestaurantSaveRequest(name = "Restaurant 1"))
    restaurantService.createRestaurant(team2, RestaurantSaveRequest(name = "Restaurant 1"))

    val request = post("/api/restaurantImport/import")
      .content(restaurantImportJson)
      .contentType(MediaType.APPLICATION_JSON)
      .header(RestaurantImport.headerName, team2.importApiKey)

    mockMvc.perform(request)
      .andExpect(MockMvcResultMatchers.status().isOk)

    val restaurant = restaurantService.findByTeamAndName(team2, "Restaurant 1")!!
    val dishes = dishService.findAllDishesByRestaurantId(restaurant.id)
    assertThat(dishes).hasSize(3)
  }

  @Test
  fun shouldReturnErrorIfTheApiKeyIsWrong() {
    val team1 = testFactoriesService.createTeam1()
    val team2 = testFactoriesService.createTeam2()

    restaurantService.createRestaurant(team1, RestaurantSaveRequest(name = "Restaurant 1"))
    restaurantService.createRestaurant(team2, RestaurantSaveRequest(name = "Restaurant 1"))

    val fakeApiKey = "fakeapikeyfakeapikey"

    val request = post("/api/restaurantImport/import")
      .content(restaurantImportJson)
      .contentType(MediaType.APPLICATION_JSON)
      .header(RestaurantImport.headerName, fakeApiKey)

    expectUnauthorizedWithMessage(request, "Invalid API Key")
  }

  @Test
  fun itShouldUpdateExistingDishesInTheRestaurant() {
    val team1 = testFactoriesService.createTeam1()

    val (restaurant, dishes) = testFactoriesService.createRestaurantAndDishes(team1)

    val updatedDishes = dishes.map { dish -> dish.copy(category = "Updated " + dish.category, price = dish.price * 2) }

    val request = post("/api/restaurantImport/import")
      .content(createRestaurantsJson(restaurant, updatedDishes))
      .contentType(MediaType.APPLICATION_JSON)
      .header(RestaurantImport.headerName, team1.importApiKey)

    mockMvc.perform(request)
      .andExpect(MockMvcResultMatchers.status().isOk)

    val resultDishes = dishService.findAllDishesByRestaurantId(restaurant.id)

    assertThat(resultDishes.size).isEqualTo(updatedDishes.size)

    resultDishes.sortedBy { it.id }.zip(updatedDishes.sortedBy { it.id }).forEach { (result, expected) ->
      assertThat(result.name).isEqualTo(expected.name)
      assertThat(result.price).isEqualTo(expected.price)
      assertThat(result.category).isEqualTo(expected.category)
      assertThat(result.sideDishes).isEqualTo(expected.sideDishes)
    }
  }

  @Test
  fun itShouldKeepTheOrderOfTheExistingDishesInTheRestaurant() {
    val team1 = testFactoriesService.createTeam1()

    val restaurant = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1"))
    createDish(2, 120, team1, restaurant)
    createDish(3, 0, team1, restaurant)

    val request = post("/api/restaurantImport/import")
      .content(restaurantImportJson)
      .contentType(MediaType.APPLICATION_JSON)
      .header(RestaurantImport.headerName, team1.importApiKey)

    mockMvc.perform(request)
      .andExpect(MockMvcResultMatchers.status().isOk)

    val resultDishes = dishService.findAllDishesByRestaurantId(restaurant.id)

    assertThat(resultDishes.size).isEqualTo(3)

    assertThat(resultDishes[0].name).isEqualTo("Dish 1")
    assertThat(resultDishes[0].price).isEqualTo(100)
    assertThat(resultDishes[0].sideDishes).hasSize(1)

    assertThat(resultDishes[1].name).isEqualTo("Dish 2")
    assertThat(resultDishes[1].price).isEqualTo(200)
    assertThat(resultDishes[1].sideDishes).hasSize(0)

    assertThat(resultDishes[2].name).isEqualTo("Dish 3")
    assertThat(resultDishes[2].price).isEqualTo(0)
    assertThat(resultDishes[2].sideDishes).hasSize(0)
  }

  private fun createDish(
    dishNumber: Int,
    price: Int,
    team1: Team,
    restaurant: Restaurant
  ): Dish {
    val sideDishesList = (1 to 3).toList().map { i ->
      SideDish(name = "Side dish $i", price = 100)
    }

    val dishCreateRequest1 = DishCreateRequest(
      "Dish ${dishNumber}",
      price,
      category = "Category 1",
      sideDishes = sideDishesList
    )
    return dishService.saveDish(team1, restaurant.id, dishCreateRequest1)
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
