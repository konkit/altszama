package altszama.app.restaurantImport

import altszama.app.team.TeamService
import altszama.app.validation.RestaurantImportInvalidApiKey
import altszama.app.validation.RestaurantImportNoApiKey
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.Parameter
import io.swagger.v3.oas.annotations.security.SecurityRequirement
import jakarta.servlet.http.HttpServletRequest
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.*

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
  @SecurityRequirement(name = "ImportApiKeyAuth")
  fun handlePayload(
    @RequestHeader(RestaurantImport.headerName) @Parameter(hidden = true) apiKeyHeaderValue: String?,
    @RequestBody restaurantData: RestaurantImportJson,
    request: HttpServletRequest
  ): ResponseEntity<RestaurantImportResponse> {
    val apiKeyOpt = Optional.ofNullable(apiKeyHeaderValue)

    if (apiKeyOpt.isEmpty) {
      throw RestaurantImportNoApiKey()
    } else {
      val apiKey = apiKeyOpt.get()

      val teamOpt = teamService.findByImportApiKey(apiKey)

      return if (teamOpt.isEmpty) {
        throw RestaurantImportInvalidApiKey()
      } else {
        val team = teamOpt.get()
        service.createFromJson(team, restaurantData)

        ResponseEntity(RestaurantImportResponse("Import successful"), HttpStatus.OK)
      }
    }
  }

}
