package altszama.app.dish;

import org.springframework.data.mongodb.repository.MongoRepository


interface DishRepository : MongoRepository<Dish, String> {
  fun findByRestaurantId(restaurantId: String): List<Dish>
  fun countAllByRestaurantId(restaurantId: String): Long
}
