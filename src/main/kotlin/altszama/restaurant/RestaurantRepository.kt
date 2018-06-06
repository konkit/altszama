package altszama.restaurant;

import org.springframework.data.mongodb.repository.MongoRepository;

interface RestaurantRepository : MongoRepository<Restaurant, String> {
  fun findByIdExists(restaurantId: String): Boolean

  fun findByName(name: String): Restaurant?
}
