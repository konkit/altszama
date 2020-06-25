package altszama.app.team;

import org.springframework.data.mongodb.repository.MongoRepository;

interface TeamRepository : MongoRepository<Team, String> {
  fun findByName(name: String): Team?
}
