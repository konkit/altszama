package altszama.restaurant;

import org.springframework.data.mongodb.repository.MongoRepository;

interface RestaurantRepository : MongoRepository<Restaurant, String> {
  fun findByName(name: String): Restaurant?
}
