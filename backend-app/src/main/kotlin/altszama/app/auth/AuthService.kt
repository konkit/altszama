package altszama.app.auth

import altszama.app.activityLog.ActivityEventService
import altszama.config.SecretsConfig
import com.google.api.services.oauth2.model.Userinfoplus
import io.jsonwebtoken.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service
import java.util.*

@Service
class AuthService(envVarConfig: SecretsConfig) {

  @Autowired
  private lateinit var userRepository: UserRepository

  private val clientSecret: String = envVarConfig.googleClientSecret

  fun currentUser(): User {
    val securityContext = SecurityContextHolder.getContext()
    val auth = securityContext.authentication

    val userId = auth.principal as String

    return userRepository.findById(userId).orElseThrow { UnauthorizedException() }
  }

  @Throws(JwtException::class)
  fun getUserIdFromJwt(tokenStr: String): String {
    return Jwts.parser()
        .setSigningKey(clientSecret)
        .parseClaimsJws(tokenStr)
        .body
        .subject
  }

  fun getJwtTokenFromUserInfo(name: String, email: String): AuthTokenInfo {
    val user = userRepository.findByEmail(email) ?: createNewUser(name, email)

    val token = createJwt(user.id)

    return AuthTokenInfo(token, user.id, user.username)
  }

  fun createNewUser(name: String, email: String): User {
    val newUser = User(name, "somePlaceholderPassword", email)
    userRepository.save(newUser)
    return newUser
  }

  fun createJwt(userId: String): String {
    return Jwts.builder()
        .setSubject(userId)
        .setExpiration(Date(System.currentTimeMillis() + 864_000_000))
        .signWith(SignatureAlgorithm.HS512, clientSecret)
        .compact()
  }
}
