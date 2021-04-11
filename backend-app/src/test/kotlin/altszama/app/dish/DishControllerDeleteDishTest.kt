package altszama.app.dish

import altszama.app.dish.dto.DishCreateRequest
import altszama.app.order.OrderService
import altszama.app.order.dto.DeliveryData
import altszama.app.order.dto.OrderSaveRequest
import altszama.app.order.dto.PaymentData
import altszama.app.orderEntry.OrderEntryService
import altszama.app.orderEntry.dto.OrderEntrySaveRequest
import altszama.app.restaurant.RestaurantService
import altszama.app.restaurant.dto.RestaurantSaveRequest
import altszama.app.test.AbstractIntegrationTest
import altszama.app.test.TestFactoriesService
import altszama.app.validation.DishInUse
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import java.time.LocalDate
import java.time.LocalTime

internal class DishControllerDeleteDishTest : AbstractIntegrationTest() {

  @Autowired
  private lateinit var dishService: DishService

  @Autowired
  private lateinit var mockMvc: MockMvc

  @Autowired
  private lateinit var restaurantService: RestaurantService

  @Autowired
  private lateinit var orderService: OrderService

  @Autowired
  private lateinit var orderEntryService: OrderEntryService

  @Autowired
  private lateinit var testFactoriesService: TestFactoriesService


  @Test
  fun itShouldDeleteDishSuccessfully() {
    val team1 = testFactoriesService.createTeam1()
    val (user1Token, user) = testFactoriesService.createUser1WithToken(team1)

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
    val team1 = testFactoriesService.createTeam1()
    val (user1Token, user) = testFactoriesService.createUser1WithToken(team1)

    val fakeDishId = "111111111111111111111111"

    val request = MockMvcRequestBuilders.delete("/api/dishes/${fakeDishId}/delete")
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user1Token)

    expectBadRequestWithMessage(request, "Dish does not exist")
  }

  @Test
  fun itShouldNotDeleteDishIfUserHasNoAccessToRestaurant() {
    val team1 = testFactoriesService.createTeam1()
    val (user1Token, user) = testFactoriesService.createUser1WithToken(team1)

    val team2 = testFactoriesService.createTeam2()

    val restaurant = restaurantService.createRestaurant(team2, RestaurantSaveRequest("Restaurant 1", address = "Address 1"))
    val dish1 = dishService.saveDish(team2, restaurant.id, DishCreateRequest("Dish 1", 100, category = "Category 1"))

    val request = MockMvcRequestBuilders.delete("/api/dishes/${dish1.id}/delete")
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user1Token)

    expectBadRequestWithMessage(request, "You have no access to this restaurant")
  }

  @Test
  fun itShouldNotDeleteDishIfItIsIsUse() {
    val team1 = testFactoriesService.createTeam1()
    val (user1Token, user1) = testFactoriesService.createUser1WithToken(team1)

    val restaurant = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1", address = "Address 1"))
    val dish1 = dishService.saveDish(team1, restaurant.id, DishCreateRequest("Dish 1", 100, category = "Category 1"))

    val orderSaveRequest = OrderSaveRequest(restaurantId = restaurant.id, orderDate = LocalDate.now(), timeOfOrder = LocalTime.of(14, 0), deliveryData = DeliveryData(), paymentData = PaymentData())
    val order = orderService.saveOrder(orderSaveRequest, currentUser = user1, currentUserTeam = team1)

    val orderEntrySaveRequest = OrderEntrySaveRequest(orderId = order.id, dishId = dish1.id, newDish = false, newDishName = null, newDishPrice = null)
    val orderEntry = orderEntryService.saveEntry(user1, team1, orderEntrySaveRequest)

    val request = MockMvcRequestBuilders.delete("/api/dishes/${dish1.id}/delete")
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", user1Token)

    expectBadRequestWithMessage(request, DishInUse().message)
  }

}
