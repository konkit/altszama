package altszama.app.team

import altszama.app.auth.User
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class TeamService {

    @Autowired
    private lateinit var teamRepository: TeamRepository

    fun getList(): List<Team> {
        return teamRepository.findAll()
    }

//    fun getTeamsForUser(user: User) {
//        getExplicitTeams(user) + getTeamsByDomain(user)
//    }
//
//    private fun getExplicitTeams(user: User): List<Team> {
//        TODO("Not yet implemented")
//    }
//
//    private fun getTeamsByDomain(user: User): Array<Team> {
//
//    }

}