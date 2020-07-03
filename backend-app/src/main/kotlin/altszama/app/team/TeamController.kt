package altszama.app.team

import altszama.app.auth.AuthService
import altszama.app.team.dto.CreateTeamDto
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/teams")
class TeamController {

    @Autowired
    private lateinit var authService: AuthService

    @Autowired
    private lateinit var teamService: TeamService

    @GetMapping("/all")
    fun getAll(): List<Team> {
        return teamService.getAll()
    }

    @GetMapping("/user")
    fun getForUser(): List<Team> {
        val currentUser = authService.currentUser()
        return teamService.getForUser(currentUser)
    }

    @PostMapping("/create")
    fun createTeam(@RequestBody dto: CreateTeamDto) {
        teamService.save(dto)
    }

}