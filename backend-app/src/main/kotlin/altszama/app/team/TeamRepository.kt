package altszama.app.team;

import altszama.app.auth.User
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query

interface TeamRepository : MongoRepository<Team, String> {

//  @Query("{'users': ?0}")
//  fun findByUser(user: User): List<Team>
//
//  fun findByDomain(domain: String): List<Team>
//
//  fun verifyUserEmail(email: String): Boolean {
//
//  }
}
