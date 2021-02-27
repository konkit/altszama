package altszama.app.team

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.util.*

@Service
class TeamService {

    @Autowired
    private lateinit var teamRepository: TeamRepository

    fun findById(id: String): Optional<Team> {
        return teamRepository.findById(id)
    }

//    fun getAll(): List<Team> {
//        return teamRepository.findAll()
//    }
//
//    fun getForUser(user: User): List<Team> {
//        return getExplicitTeams(user) + getTeamsByDomain(user)
//    }
//
//    private fun getExplicitTeams(user: User): List<Team> {
//        return teamRepository.findByUser(user)
//    }
//
//    private fun getTeamsByDomain(user: User): List<Team> {
//        val domain = user.email.split("@")[1]
//        return teamRepository.findByDomain(domain)
//    }
//
//    fun save(dto: CreateTeamDto): Any {
//        val team = Team(
//                id = ObjectId().toHexString(),
//                domain = dto.domain
//        )
//        return teamRepository.save(team)
//    }

}
