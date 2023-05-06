package altszama.app.auth

import io.jsonwebtoken.JwtException
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service
import java.util.*


data class AuthUserInfo(val token: String, val userId: String, val username: String)


@Service
class UserService() {

  private val jwtSigningKey = Keys.secretKeyFor(SignatureAlgorithm.HS512);

  @Autowired
  private lateinit var userRepository: UserRepository

  fun currentUser(): User {
    val securityContext = SecurityContextHolder.getContext()
    val auth = securityContext.authentication

    val userId = auth.principal as String

    return userRepository.findById(userId).orElseThrow { UnauthorizedException() }
  }

  @Throws(JwtException::class)
  fun getUserIdFromJwt(tokenStr: String): String {
    return Jwts.parser()
        .setSigningKey(jwtSigningKey)
        .parseClaimsJws(tokenStr)
        .body
        .subject
  }

  fun createJwtTokenFromUserInfo(name: String, email: String): AuthUserInfo {
    val user = userRepository.findByEmail(email).orElseGet { createNewUser(name, email) }

    val token = createJwt(user.id)

    return AuthUserInfo(token, user.id, user.username)
  }

  fun createNewUser(name: String, email: String): User {
    val newUser = User(name, "somePlaceholderPassword", email)
    userRepository.save(newUser)
    return newUser
  }

  fun findByEmail(email: String): Optional<User> {
    return userRepository.findByEmail(email)
  }

  fun createJwt(userId: String): String {
    return Jwts.builder()
        .setSubject(userId)
        .setExpiration(Date(System.currentTimeMillis() + 864_000_000))
        .signWith(jwtSigningKey)
        .compact()
  }
}
