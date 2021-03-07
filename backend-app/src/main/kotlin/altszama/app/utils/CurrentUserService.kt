package altszama.app.utils

import altszama.app.auth.User
import altszama.app.auth.UserService
import altszama.app.team.Team
import altszama.app.team.TeamService
import altszama.app.validation.AltszamaErrorException
import altszama.app.validation.UserDoesNotBelongToAnyTeam
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class CurrentUserService {

  @Autowired
  private lateinit var userService: UserService

  @Autowired
  private lateinit var teamService: TeamService

  fun getCurrentUser(): User {
    return userService.currentUser()
  }

  @Throws(AltszamaErrorException::class)
  fun getCurrentUserTeam(): Team {
    val currentUser = userService.currentUser()
    return teamService.findByUser(currentUser).orElseThrow { UserDoesNotBelongToAnyTeam() }
  }

}
