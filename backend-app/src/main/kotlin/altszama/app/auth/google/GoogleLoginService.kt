package altszama.app.auth.google

import altszama.app.activityLog.ActivityEventService
import altszama.app.auth.AuthUserInfo
import altszama.app.auth.UserService
import altszama.app.team.Team
import altszama.app.team.TeamService
import arrow.core.Either
import arrow.core.computations.either
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service


sealed class GoogleAuthResult
data class GoogleAuthSuccess(val userInfo: AuthUserInfo, val userEmail: String) : GoogleAuthResult()
data class GoogleAuthError(val message: String) : GoogleAuthResult()


@Service
class GoogleLoginService() {

  private val logger = LoggerFactory.getLogger(GoogleLoginService::class.java)

  @Autowired
  private lateinit var userService: UserService

  @Autowired
  private lateinit var activityEventService: ActivityEventService

  @Autowired
  private lateinit var teamService: TeamService

  @Autowired
  private lateinit var googleLoginApiService: GoogleLoginApiService

  suspend fun verifyUser(idToken: String): Either<GoogleAuthError, GoogleAuthSuccess> {
    return either {
      val verifiedToken: GoogleIdToken = googleLoginApiService.verifyGoogleToken(idToken).bind()
      val tokenPayload: GoogleIdToken.Payload = verifiedToken.payload
      val team = findUserTeam(tokenPayload.email).bind()

      logger.info("User ${tokenPayload.email} (<${tokenPayload.email}>) just logged in")

      val authInfo = userService.createJwtTokenFromUserInfo(tokenPayload.get("name").toString(), tokenPayload.email)

      activityEventService.saveUserLogin(authInfo.userId)

      GoogleAuthSuccess(authInfo, tokenPayload.email)
    }
  }

  private fun findUserTeam(email: String): Either<GoogleAuthError, Team> {
    val teamOpt = teamService.findByEmail(email)

    return if (teamOpt.isPresent) {
      Either.right(teamOpt.get())
    } else {
      Either.left(GoogleAuthError("Your account does not belong to any team. Make sure that you use your company email."))
    }
  }
}
