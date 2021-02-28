package altszama.app.auth.google

import altszama.config.SecretsConfig
import arrow.core.Either
import com.google.api.client.auth.oauth2.TokenResponseException
import com.google.api.client.googleapis.auth.oauth2.*
import com.google.api.client.googleapis.json.GoogleJsonResponseException
import com.google.api.client.http.javanet.NetHttpTransport
import com.google.api.client.json.jackson2.JacksonFactory
import com.google.api.services.oauth2.Oauth2
import com.google.api.services.oauth2.model.Userinfoplus
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service


@Service
class GoogleLoginApiService(envVarConfig: SecretsConfig) {

  private val logger = LoggerFactory.getLogger(GoogleLoginApiService::class.java)

  private var clientId = envVarConfig.googleClientId

  private var clientSecret = envVarConfig.googleClientSecret

  private val netHttpTransport = NetHttpTransport()

  private val jacksonFactory = JacksonFactory()


  fun fetchAccessToken(authorizationCode: String): Either<GoogleAuthError, GoogleTokenResponse> {
    val redirectUrl = "postmessage"

    return try {
      val codeTokenRequest = GoogleAuthorizationCodeTokenRequest(
          netHttpTransport, jacksonFactory, clientId, clientSecret, authorizationCode, redirectUrl
      )

      val response = codeTokenRequest.execute()
      Either.right(response)
    } catch (e: TokenResponseException) {
      logTokenResponseException(e)
      Either.left(GoogleAuthError("Couldn't fetch access token"))
    } catch (e: GoogleJsonResponseException) {
      logGoogleJsonResponseException(e)
      Either.left(GoogleAuthError("Couldn't fetch access token"))
    }
  }

  private fun logTokenResponseException(e: TokenResponseException) {
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

  private fun logGoogleJsonResponseException(e: GoogleJsonResponseException) {
    logger.error(e.message)
    logger.error(e.details.message)
    logger.error(e.details.code.toString())
    logger.error(e.details.errors.joinToString(","))
  }


  fun verifyGoogleToken(idTokenString: String?): Either<GoogleAuthError, GoogleIdToken> {
    try {
      val verifier = GoogleIdTokenVerifier.Builder(netHttpTransport, jacksonFactory)
          .setAudience(listOf(clientId))
          .build()

      val idToken = verifier.verify(idTokenString)

      return if (idToken == null) {
        Either.left(GoogleAuthError("Couldn't verify token"))
      } else {
        Either.right(idToken)
      }
    } catch (e: Exception) {
      logger.error("Couldn't verify token", e)
      return Either.left(GoogleAuthError("Couldn't verify token"))
    }
  }

  fun fetchUserInfo(accessTokenResponse: GoogleTokenResponse): Either<GoogleAuthError, Userinfoplus> {
    return try {
      val credential = GoogleCredential().setAccessToken(accessTokenResponse.accessToken)
      val oauth2 = Oauth2.Builder(netHttpTransport, jacksonFactory, credential).build()
      val userinfo: Userinfoplus = oauth2.userinfo().get().execute()

      Either.right(userinfo)
    } catch (e: Exception) {
      logger.error("Couldn't fetch user info", e)
      return Either.left(GoogleAuthError("Couldn't fetch user info"))
    }
  }
}
