package altszama.app.order.controller

import altszama.app.dish.DishService
import altszama.app.dish.dto.DishCreateRequest
import altszama.app.order.dto.CreateOrderInitialData
import altszama.app.restaurant.RestaurantService
import altszama.app.restaurant.dto.RestaurantSaveRequest
import altszama.app.test.AbstractIntegrationTest
import altszama.app.test.TestFactoriesService
import com.fasterxml.jackson.databind.ObjectMapper
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers

class OrderControllerCreateOrderTest() : AbstractIntegrationTest() {

  @Autowired
  private lateinit var mockMvc: MockMvc

  @Autowired
  private lateinit var restaurantService: RestaurantService

  @Autowired
  private lateinit var dishService: DishService

  @Autowired
  private lateinit var objectMapper: ObjectMapper

  @Autowired
  private lateinit var testFactoriesService: TestFactoriesService


  @Test
  fun itShouldReturnCreateDataSuccessfully() {
    val team1 = testFactoriesService.createTeam1()
    val (token, user) = testFactoriesService.createUser1WithToken(team1)

    val restaurant = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1"))
    val dish1 = dishService.saveDish(team1, restaurant.id, DishCreateRequest("Dish 1", 100, category = "Category 1"))

    val request = MockMvcRequestBuilders.get("/api/orders/create.json")
        .header("Authorization", token)

    val responseJson = mockMvc.perform(request)
        .andExpect(MockMvcResultMatchers.status().isOk)
        .andReturn()
        .response.contentAsString

    val response = objectMapper.readValue(responseJson, CreateOrderInitialData::class.java)

    assertThat(response.restaurantsList.map { it.id} ).hasSameElementsAs(listOf(restaurant).map { it.id })
  }

  @Test
  fun itShouldReturnRestaurantsOnlyFromTheCorrectTeam() {
    val team1 = testFactoriesService.createTeam1()
    val restaurant1 = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1"))

    val team2 = testFactoriesService.createTeam2()
    val restaurant2 = restaurantService.createRestaurant(team2, RestaurantSaveRequest("Restaurant 2"))

    val (token, user) = testFactoriesService.createUser1WithToken(team1)

    val request = MockMvcRequestBuilders.get("/api/orders/create.json")
        .header("Authorization", token)

    val responseJson = mockMvc.perform(request)
        .andExpect(MockMvcResultMatchers.status().isOk)
        .andReturn()
        .response.contentAsString

    val response = objectMapper.readValue(responseJson, CreateOrderInitialData::class.java)

    assertThat(response.restaurantsList).hasSize(1)
    assertThat(response.restaurantsList.map { it.id} ).hasSameElementsAs(listOf(restaurant1).map { it.id })
  }

}
