package altszama.app.e2e

import altszama.app.auth.UserService
import altszama.app.auth.User
import altszama.app.dish.Dish
import altszama.app.dish.DishRepository
import altszama.app.order.Order
import altszama.app.order.OrderRepository
import altszama.app.orderEntry.DishEntry
import altszama.app.orderEntry.OrderEntry
import altszama.app.orderEntry.OrderEntryRepository
import altszama.app.restaurant.Restaurant
import altszama.app.restaurant.RestaurantRepository
import altszama.app.team.Team
import altszama.app.team.TeamRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Profile
import org.springframework.stereotype.Service
import java.time.LocalDate
import java.time.LocalTime
import kotlin.random.Random

@Service
@Profile("development")
class TestEnvironmentService {

  @Autowired()
  private lateinit var restaurantRepository: RestaurantRepository

  @Autowired()
  private lateinit var dishRepository: DishRepository

  @Autowired
  private lateinit var orderRepository: OrderRepository

  @Autowired
  private lateinit var orderEntryRepository: OrderEntryRepository

  @Autowired
  private lateinit var userService: UserService

  @Autowired
  private lateinit var teamRepository: TeamRepository

  fun clearEverything() {
    dishRepository.deleteAll()
    restaurantRepository.deleteAll()
    orderEntryRepository.deleteAll()
    orderRepository.deleteAll()
    teamRepository.deleteAll()
  }

  fun generateEverything() {
    clearEverything()

    val team = Team(domain = "altszama.club", userEmails = emptyList())
    teamRepository.save(team)

    val user1 = userService.createNewUser("John Doe", "john.doe@altszama.club")
    val user2 = userService.createNewUser("James Bond", "james.bond@altszama.club")
    val user3 = userService.createNewUser("Jackie Chan", "jackie.chan@altszama.club")

    val pizzeria = createRestaurant("Pizzeria")
    val chineseSpot = createRestaurant("Chinese spot")

    val order1 = Order(
        restaurant = pizzeria.restaurant,
        orderCreator = user1,
        orderDate = LocalDate.now(),
        timeOfOrder = LocalTime.of(14, 0)
    )
    val order = orderRepository.save(order1)

    createOrderEntry(order, user1, pizzeria)
    createOrderEntry(order, user2, pizzeria)
    createOrderEntry(order, user3, pizzeria)
  }

  private fun createRestaurant(restaurantName: String): RestaurantWithDishes {
    val restaurant = restaurantRepository.save(Restaurant(name = restaurantName))

    val dishes = (1..15).map { i ->
      dishRepository.save(Dish(restaurant, name = "Dish ${i}", price = randomPrice(), category = "Category ${i/5}"))
    }

    return RestaurantWithDishes(restaurant, dishes)
  }

  private fun createOrderEntry(order: Order, user1: User, restaurantWithDishes: RestaurantWithDishes): OrderEntry {
    val orderEntry = OrderEntry(
        order = order,
        user = user1,
        dishEntries = listOf(DishEntry(restaurantWithDishes.dishes.random()))
    )
    return orderEntryRepository.save(orderEntry)
  }

  private fun randomPrice(): Int {
    return Random.nextInt(15, 25) * 100
  }
}

data class RestaurantWithDishes(val restaurant: Restaurant, val dishes: List<Dish>)


