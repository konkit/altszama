package altszama.app.e2e

import altszama.app.dish.DishRepository
import altszama.app.order.OrderRepository
import altszama.app.orderEntry.OrderEntryRepository
import altszama.app.restaurant.RestaurantRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Profile
import org.springframework.stereotype.Service

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

  fun clearEverything() {
    dishRepository.deleteAll()
    restaurantRepository.deleteAll()
    orderEntryRepository.deleteAll()
    orderRepository.deleteAll()
  }
}
