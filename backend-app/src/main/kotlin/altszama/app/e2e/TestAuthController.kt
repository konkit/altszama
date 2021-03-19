package altszama.app.e2e

import altszama.app.auth.AuthUserInfo
import altszama.app.auth.User
import altszama.app.auth.UserRepository
import altszama.app.auth.UserService
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
  private lateinit var userService: UserService

  @Autowired
  private lateinit var userRepository: UserRepository

  data class Payload(val username: String, val email: String)

  @RequestMapping("/auth/testUser/login")
  fun testLogin(@RequestBody payload: Payload): AuthUserInfo {
    return userService.createJwtTokenFromUserInfo(payload.username, payload.email);
  }

  @RequestMapping("/auth/testUser/list")
  fun getTestUsersList(): List<User> {
    return userRepository.findAll()
  }
}
