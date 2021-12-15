package altszama.app.test

import altszama.app.auth.User
import altszama.app.auth.UserService
import altszama.app.dish.Dish
import altszama.app.dish.DishService
import altszama.app.dish.SideDish
import altszama.app.dish.dto.DishCreateRequest
import altszama.app.order.Order
import altszama.app.order.OrderService
import altszama.app.order.dto.DeliveryData
import altszama.app.order.dto.OrderSaveRequest
import altszama.app.order.dto.PaymentData
import altszama.app.orderEntry.OrderEntry
import altszama.app.orderEntry.OrderEntryService
import altszama.app.orderEntry.dto.OrderEntrySaveRequest
import altszama.app.restaurant.Restaurant
import altszama.app.restaurant.RestaurantService
import altszama.app.restaurant.dto.RestaurantSaveRequest
import altszama.app.team.Team
import altszama.app.team.TeamService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.time.LocalDate
import java.time.LocalTime

@Service
class TestFactoriesService {

  @Autowired
  private lateinit var userService: UserService

  @Autowired
  private lateinit var restaurantService: RestaurantService

  @Autowired
  private lateinit var dishService: DishService

  @Autowired
  private lateinit var orderService: OrderService

  @Autowired
  private lateinit var orderEntryService: OrderEntryService

  @Autowired
  private lateinit var teamService: TeamService

  val fakeOrderId = "111111111111111111111111"

  fun createTeam1(): Team {
    return teamService.createTeam("team1.com", "team1.com")
  }

  fun createTeam2(): Team {
    return teamService.createTeam("team2.com", "team2.com")
  }

  fun createUser1WithToken(team: Team): Pair<String, User> {
    return createUserAndGetToken("John", "john@${team.domain}")
  }

  fun createUser1(team: Team): User {
    return createUser1WithToken(team).second
  }

  fun createUser2WithToken(team: Team): Pair<String, User> {
    return createUserAndGetToken("James", "james@${team.domain}")
  }

  fun createUser2(team: Team): User {
    return createUser2WithToken(team).second
  }

  fun createUser3WithToken(team: Team): Pair<String, User> {
    return createUserAndGetToken("Jack", "jack@${team.domain}")
  }

  fun createUser3(team: Team): User {
    return createUser3WithToken(team).second
  }

  protected fun createUserAndGetToken(username: String, email: String): Pair<String, User> {
    val user = userService.createNewUser(username, email)
    val token = "Bearer ${userService.createJwtTokenFromUserInfo(username, email).token}"

    return Pair(token, user)
  }

  fun createRestaurantAndDishes(team1: Team): Pair<Restaurant, List<Dish>> {
    val sideDish1 = SideDish(name = "Side dish 1", price = 100)
    val sideDish2 = SideDish(name = "Side dish 2", price = 120)
    val sideDish3 = SideDish(name = "Side dish 3", price = 150)
    val sideDishesList = listOf(sideDish1, sideDish2, sideDish3)

    val restaurant = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1"))
    val dishCreateRequest1 = DishCreateRequest(
      "Dish 1",
      100,
      category = "Category 1",
      sideDishes = sideDishesList
    )
    val dish1 = dishService.saveDish(team1, restaurant.id, dishCreateRequest1)
    val dishCreateRequest2 = DishCreateRequest(
      "Dish 2",
      120,
      category = "Category 1",
      sideDishes = sideDishesList
    )
    val dish2 = dishService.saveDish(team1, restaurant.id, dishCreateRequest2)
    return Pair(restaurant, listOf(dish1, dish2))
  }

  fun createOrder(restaurant: Restaurant, user1: User, team1: Team): Order {
    val orderSaveRequest = OrderSaveRequest(
      restaurantId = restaurant.id,
      orderDate = LocalDate.now(),
      timeOfOrder = LocalTime.of(14, 0),
      deliveryData = DeliveryData(),
      paymentData = PaymentData()
    )
    return orderService.saveOrder(orderSaveRequest, currentUser = user1, currentUserTeam = team1)
  }

  fun createOrderEntry(order: Order, dish: Dish, user: User, team: Team): OrderEntry {
    val orderEntrySaveRequest = OrderEntrySaveRequest(
      orderId = order.id,
      dishId = dish.id,
      newDish = false,
      newDishName = null,
      newDishPrice = null,
      sideDishes = emptyList()
    )
    return orderEntryService.saveEntry(user, team, orderEntrySaveRequest)
  }

}
