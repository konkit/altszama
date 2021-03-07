package altszama.app.team

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.util.*

@Service
class TeamService {

  @Autowired
  private lateinit var teamRepository: TeamRepository

  fun createTeam(name: String, domain: String, userEmails: List<String> = emptyList()): Team {
    val team = Team(name = name, domain = domain, userEmails = userEmails)
    teamRepository.save(team)
    return team
  }

  fun findById(id: String): Optional<Team> {
    return teamRepository.findById(id)
  }

  fun findByEmail(email: String): Optional<Team> {
    val domain = email.substringAfter("@")
    val result = teamRepository.findByDomain(domain).or { teamRepository.findByUserEmails(email) }
    return result
  }

}
