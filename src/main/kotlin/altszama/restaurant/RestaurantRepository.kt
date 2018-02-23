package altszama.restaurant;

import org.springframework.data.mongodb.repository.MongoRepository;

interface RestaurantRepository : MongoRepository<Restaurant, String> {
  fun findById(id: String): Restaurant?

  fun findByName(name: String): Restaurant?
}
