package altszama.dish;

import org.springframework.data.mongodb.repository.MongoRepository
import java.time.Instant


interface DishRepository : MongoRepository<Dish, String> {
  fun findByRestaurantId(restaurantId: String): List<Dish>

  fun countAllByRestaurantId(restaurantId: String): Long

  fun findByRestaurantIdAndName(restaurantId: String, name: String): List<Dish>

  fun deleteAllByLastCrawledBeforeAndLastEditedIsNull(lastCrawledDate: Instant)
}
