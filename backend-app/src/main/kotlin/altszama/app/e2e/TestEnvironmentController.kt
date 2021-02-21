package altszama.app.e2e

import altszama.app.auth.AuthService
import altszama.app.auth.AuthTokenInfo
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Profile
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/e2e")
@Profile("development")
class TestEnvironmentController() {

  @Autowired
  private lateinit var testEnvironmentService: TestEnvironmentService

  @RequestMapping("/clearEverything")
  fun testLogin() {
    testEnvironmentService.clearEverything()
  }
}
