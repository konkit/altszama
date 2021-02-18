package altszama.app.auth

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Profile
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api")
@Profile("development")
class TestAuthController() {

  @Autowired
  private lateinit var authService: AuthService

  data class Payload(val username: String, val email: String)

  @RequestMapping("/auth/testLogin")
  fun testLogin(@RequestBody payload: Payload): AuthTokenInfo {
    return authService.getJwtTokenFromUserInfo(payload.username, payload.email);
  }
}
