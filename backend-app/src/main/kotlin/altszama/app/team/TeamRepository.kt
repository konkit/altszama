package altszama.app.team;

import org.springframework.data.mongodb.repository.MongoRepository
import java.util.*

interface TeamRepository : MongoRepository<Team, String> {
  fun findByDomain(domain: String): Optional<Team>
  fun findByUserEmails(email: String): Optional<Team>
  fun findByImportApiKey(importApiKey: String): Optional<Team>
}
