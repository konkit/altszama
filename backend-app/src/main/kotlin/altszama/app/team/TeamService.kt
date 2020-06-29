package altszama.app.team

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class TeamService {

    @Autowired
    private lateinit var teamRepository: TeamRepository

    fun getList(): List<Team> {
        return teamRepository.findAll()
    }


}