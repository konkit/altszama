package altszama.app.team;

import altszama.app.auth.User
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query
import java.util.*

interface TeamRepository : MongoRepository<Team, String> {
  fun findByDomain(domain: String): Optional<Team>
  fun findByUserEmails(email: String): Optional<Team>

//  @Query("{'users': ?0}")
//  fun findByUser(user: User): List<Team>
//
//
//  fun verifyUserEmail(email: String): Boolean {
//
//  }
}
