package altszama.app.team

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api")
class TeamController {

    @Autowired
    private lateinit var teamService: TeamService

    @GetMapping
    fun index(): List<Team> {
        return teamService.getList()
    }

}