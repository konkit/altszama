package altszama.dish;

import org.springframework.data.mongodb.repository.MongoRepository


interface DishRepository : MongoRepository<Dish, String> {
  fun findByName(name: String): Dish?

  fun findByRestaurantId(restaurantId: String): List<Dish>
}
