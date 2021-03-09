package altszama.app.order

import altszama.app.auth.UserService
import altszama.app.dish.DishService
import altszama.app.orderEntry.OrderEntryService
import altszama.app.restaurant.RestaurantService
import altszama.app.team.TeamService
import altszama.app.test.AbstractIntegrationTest
import com.fasterxml.jackson.databind.ObjectMapper
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.fail
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.test.web.servlet.MockMvc

class OrderControllerOrderViewTest () : AbstractIntegrationTest() {

  @Autowired
  private lateinit var mockMvc: MockMvc

  @Autowired
  private lateinit var userService: UserService

  @Autowired
  private lateinit var teamService: TeamService

  @Autowired
  private lateinit var restaurantService: RestaurantService

  @Autowired
  private lateinit var dishService: DishService

  @Autowired
  private lateinit var orderService: OrderService

  @Autowired
  private lateinit var orderEntryService: OrderEntryService

  @Autowired
  private lateinit var orderControllerDataService: OrderControllerDataService

  @Autowired
  private lateinit var objectMapper: ObjectMapper


  @Test()
  fun itShouldMoveToOrderingStateAndReturnOrderViewDataSuccessfully() {
    fail("Implement me!")
  }

  @Test()
  fun itShouldNotReturnOrderViewIfOrderDoesNotExist() {
    fail("Implement me!")
  }

  @Test()
  fun itShouldNotReturnOrderViewIfUserIsNotOrderCreator() {
    fail("Implement me!")
  }

  @Test()
  fun itShouldNotReturnOrderViewIfOrderIsAlredyPlaced() {
    fail("Implement me!")
  }

}
