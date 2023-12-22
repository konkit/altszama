package altszama.app.auth

import altszama.app.auth.google.GoogleAuthError
import altszama.app.auth.google.GoogleAuthResult
import altszama.app.auth.google.GoogleAuthSuccess
import altszama.app.auth.google.GoogleLoginService
import arrow.core.Either
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import io.swagger.v3.oas.annotations.security.SecurityRequirements
import kotlinx.coroutines.runBlocking
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api")
class AuthController() {

  @Autowired
  private lateinit var googleLoginService: GoogleLoginService

  data class GooglePayload(val credential: String, val clientId: String, val select_by: String)

  @PostMapping("/auth/googleLogin/authorizationCode")
  @ApiResponses(value = [
    ApiResponse(
      responseCode="200",
      description = "Success",
      content = [Content(mediaType = "application/json", schema = Schema(implementation = GoogleAuthSuccess::class))]
    ),
    ApiResponse(
      responseCode="400",
      description = "Error",
      content = [Content(mediaType = "application/json", schema = Schema(implementation = GoogleAuthError::class))]
    )
  ])
  @SecurityRequirements
  fun loginWithReceivedJwt(@RequestBody googlePayload: GooglePayload): ResponseEntity<out GoogleAuthResult> {
    return runBlocking {
      when(val result = googleLoginService.verifyUser(googlePayload.credential)) {
        is Either.Left ->
          ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result.value);
        is Either.Right ->
          ResponseEntity.ok(result.value);
      }
    }
  }
}
