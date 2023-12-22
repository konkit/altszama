package altszama.app.auth.google

import altszama.config.SecretsConfig
import arrow.core.Either
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier
import com.google.api.client.http.javanet.NetHttpTransport
import com.google.api.client.json.gson.GsonFactory
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service


@Service
class GoogleLoginApiService(envVarConfig: SecretsConfig) {

  private val logger = LoggerFactory.getLogger(GoogleLoginApiService::class.java)

  private var clientId = envVarConfig.googleClientId

  private val netHttpTransport = NetHttpTransport()

  private val jsonFactory = GsonFactory()

  fun verifyGoogleToken(idTokenString: String?): Either<GoogleAuthError, GoogleIdToken> {
    try {
      val verifier = GoogleIdTokenVerifier.Builder(netHttpTransport, jsonFactory)
          .setAudience(listOf(clientId))
          .build()

      val idToken = verifier.verify(idTokenString)

      return if (idToken == null) {
        Either.Left(GoogleAuthError("Couldn't verify Google Sign-in token"))
      } else {
        Either.Right(idToken)
      }
    } catch (e: Exception) {
      logger.error("Couldn't verify Google Sign-in token", e)
      return Either.Left(GoogleAuthError("Couldn't verify Google Sign-in token"))
    }
  }
}
