package altszama.app.restaurantImport

import altszama.app.team.TeamService
import altszama.app.validation.RestaurantImportInvalidCredentials
import altszama.app.validation.RestaurantImportNoBasicAuth
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.Parameter
import io.swagger.v3.oas.annotations.security.SecurityRequirement
import org.apache.http.HttpHeaders
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.nio.charset.StandardCharsets
import java.util.*
import javax.servlet.http.HttpServletRequest

data class RestaurantImportResponse(val message: String)

@RestController
@RequestMapping("/api")
class RestaurantImportController {

  @Autowired
  private lateinit var service: RestaurantImportService

  @Autowired
  private lateinit var teamService: TeamService

  @PostMapping(value = ["/restaurantImport/import"], consumes = ["application/json"], produces = ["application/json"])
  @Operation(summary = "Create or update a new restaurant with all dishes", description = "")
  @SecurityRequirement(name = "basicAuth")
  fun handlePayload(
    @RequestHeader(HttpHeaders.AUTHORIZATION) @Parameter(hidden = true) authorizationHeader: String?,
    @RequestBody restaurantData: RestaurantImportJson,
    request: HttpServletRequest
  ): ResponseEntity<RestaurantImportResponse> {
    val usernamePasswordOpt = getUsernameAndPasswordFromHeader(authorizationHeader)

    if (usernamePasswordOpt.isEmpty) {
      throw RestaurantImportNoBasicAuth()
    } else {
      val (username, password) = usernamePasswordOpt.get()

      val teamOpt = teamService.findByImportUsername(username)

      return if (teamOpt.isEmpty) {
        throw RestaurantImportInvalidCredentials()
      } else {
        val team = teamOpt.get()

        val authenticated = team.importPassword == password

        if (!authenticated) {
          throw RestaurantImportInvalidCredentials()
        } else {
          service.createFromJson(team, restaurantData)

          ResponseEntity(RestaurantImportResponse("Import successful"), HttpStatus.CREATED)
        }
      }
    }
  }

  private fun getUsernameAndPasswordFromHeader(authorizationHeader: String?): Optional<Pair<String, String>> {
    return Optional.ofNullable(authorizationHeader)
      .filter { h -> h.toLowerCase().startsWith("basic") }
      .map { h ->
        val base64Credentials = h.substring("Basic".length).trim();
        val credDecoded = Base64.getDecoder().decode(base64Credentials);
        val credentials = String(credDecoded, StandardCharsets.UTF_8);
        val (username, password) = credentials.split(":")
        Pair(username, password)
      }
  }

}
