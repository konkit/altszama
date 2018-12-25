package altszama.dish;

import org.springframework.data.mongodb.repository.MongoRepository


interface DishRepository : MongoRepository<Dish, String> {
  fun findByRestaurantId(restaurantId: String): List<Dish>

  fun findByRestaurantIdAndName(restaurantId: String, name: String): List<Dish>
}
