package altszama.app.auth.google

import altszama.app.activityLog.ActivityEventService
import altszama.app.auth.AuthUserInfo
import altszama.app.auth.UserService
import altszama.app.team.Team
import altszama.app.team.TeamService
import altszama.config.SecretsConfig
import arrow.core.Either
import arrow.core.computations.either
import com.google.api.services.oauth2.model.Userinfoplus
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service


sealed class GoogleAuthResult
data class GoogleAuthSuccess(val userInfo: AuthUserInfo) : GoogleAuthResult()
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


  suspend fun verifyTokenAndGetUserInfo(authCode: String): Either<GoogleAuthError, GoogleAuthSuccess> {
    return either {
      val accessTokenResponse = googleLoginApiService.fetchAccessToken(authCode).bind()
      val tokenVerified = googleLoginApiService.verifyGoogleToken(accessTokenResponse.idToken).bind()
      val userinfo = googleLoginApiService.fetchUserInfo(accessTokenResponse).bind()
      val team = findUserTeam(userinfo).bind()

      logger.info("User ${userinfo.name} (<${userinfo.email}>) just logged in")

      val authInfo = userService.createJwtTokenFromUserInfo(userinfo.name, userinfo.email)

      activityEventService.saveUserLogin(authInfo.userId)

      GoogleAuthSuccess(authInfo)
    }
  }

  private fun findUserTeam(userinfo: Userinfoplus): Either<GoogleAuthError, Team> {
    val teamOpt = teamService.findByEmail(userinfo.email)

    return if (teamOpt.isPresent) {
      Either.right(teamOpt.get())
    } else {
      Either.left(GoogleAuthError("Your account does not belong to any team. Make sure that you use your company email."))
    }
  }
}
