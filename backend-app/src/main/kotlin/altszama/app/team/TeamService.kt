package altszama.app.team

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.util.*

@Service
class TeamService {

  @Autowired
  private lateinit var teamRepository: TeamRepository

  fun createTeam(domain: String, userEmails: List<String> = emptyList()): Team {
    val team = Team(domain = domain, userEmails = userEmails)
    teamRepository.save(team)
    return team
  }

  fun findById(id: String): Optional<Team> {
    return teamRepository.findById(id)
  }

  fun findByEmail(email: String): Optional<Team> {
    val domain = email.substringAfter("@")
    return teamRepository.findByDomain(domain).or { teamRepository.findByUserEmails(email) }
  }

}
