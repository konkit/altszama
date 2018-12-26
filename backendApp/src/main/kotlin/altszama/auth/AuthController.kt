package altszama.auth

import com.google.api.client.auth.oauth2.TokenResponseException
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeTokenRequest
import com.google.api.client.googleapis.auth.oauth2.GoogleCredential
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier
import com.google.api.client.googleapis.auth.oauth2.GoogleTokenResponse
import com.google.api.client.googleapis.json.GoogleJsonResponseException
import com.google.api.client.http.javanet.NetHttpTransport
import com.google.api.client.json.jackson2.JacksonFactory
import com.google.api.services.oauth2.Oauth2
import com.google.api.services.oauth2.model.Userinfoplus
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
class AuthController {

  private val logger = LoggerFactory.getLogger(AuthController::class.java)

  @Value("\${googleClientId}")
  private lateinit var clientId: String

  @Value("\${googleClientSecret}")
  private lateinit var clientSecret: String

  @Autowired
  private lateinit var userRepository: UserRepository

  @Autowired
  private lateinit var authService: AuthService

  private val netHttpTransport = NetHttpTransport()
  private val jacksonFactory = JacksonFactory()




  @RequestMapping("/auth/authorizationCode")
  fun loginWithIdToken(@RequestParam authCode: String): AuthTokenInfo {
    logger.info("Logging with Google, clientId: $clientId, clientSecret: $clientSecret, authCode: $authCode")

    val accessTokenResponse = requestAccessToken(authCode)

    val idTokenString = accessTokenResponse.idToken

    val verifier = GoogleIdTokenVerifier.Builder(netHttpTransport, jacksonFactory)
        .setAudience(listOf(clientId))
        .build()

    val idToken = verifier.verify(idTokenString)

    if (idToken != null) {
      val credential = GoogleCredential().setAccessToken(accessTokenResponse.accessToken)
      val oauth2 = Oauth2.Builder(netHttpTransport, jacksonFactory, credential).build()
      val userinfo: Userinfoplus = oauth2.userinfo().get().execute()

      logger.info("userInfo:" + userinfo.toPrettyString())

      return authService.getUserFromUserInfo(userinfo)
    } else {
      throw RuntimeException("Google's id token is wrong")
    }
  }

  private fun requestAccessToken(authorizationCode: String): GoogleTokenResponse {
    val redirectUrl = "postmessage"

    try {
      val codeTokenRequest = GoogleAuthorizationCodeTokenRequest(
          netHttpTransport, jacksonFactory, clientId, clientSecret, authorizationCode, redirectUrl
      )

      logger.info(jacksonFactory.toString(codeTokenRequest))

      return codeTokenRequest.execute()
    } catch (e: TokenResponseException) {
      handleGoogleError(e)
      throw e
    } catch (e: GoogleJsonResponseException) {
      logger.error(e.message)
      logger.error(e.details.message)
      logger.error(e.details.code.toString())
      logger.error(e.details.errors.joinToString(","))
      throw e
    }
  }

  companion object {
    private val logger = LoggerFactory.getLogger(AuthController::class.java)

    private fun handleGoogleError(e: TokenResponseException) {
      if (e.details != null) {
        logger.error("details.error: " + e.details.error)

        if (e.details.errorDescription != null) {
          logger.error("details.errorDesc: " + e.details.errorDescription)
        }

        if (e.details.errorUri != null) {
          logger.error("details.errorUri" + e.details.errorUri)
        }
      } else {
        logger.error("details.message: " + e.message)
      }
    }
  }
}