package altszama.app.team

import altszama.app.auth.User
import org.apache.commons.lang3.StringUtils
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

  fun findByUser(user: User): Optional<Team> {
    return findByEmail(user.email)
  }

  fun findByEmail(email: String): Optional<Team> {
    val domain = email.substringAfter("@")
    return findByDomain(domain).or { findByUserEmails(email) }
  }

  private fun findByDomain(domain: String) =
      Optional.ofNullable(domain)
          .map { d -> d.trim().lowercase(Locale.getDefault()) }
          .filter { d -> d.isNotBlank() }
          .flatMap { d -> teamRepository.findByDomain(d) }

  private fun findByUserEmails(email: String) =
      Optional.ofNullable(email)
          .map { d -> d.trim().lowercase(Locale.getDefault()) }
          .filter { d -> d.isNotBlank() }
          .flatMap { e -> teamRepository.findByUserEmails(e) }

  fun findByImportApiKey(apiKeyString: String): Optional<Team> {
    return Optional.ofNullable(apiKeyString)
      .filter(StringUtils::isNotBlank)
      .flatMap { apiKey -> teamRepository.findByImportApiKey(apiKey) }
  }
}
