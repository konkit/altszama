package altszama.auth

import com.google.api.services.oauth2.model.Userinfoplus
import io.jsonwebtoken.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service
import java.util.*

@Service
class AuthService {

  @Autowired
  private lateinit var userRepository: UserRepository

  @Value("\${googleClientSecret}")
  private lateinit var clientSecret: String

  fun currentUser(): User {
    val securityContext = SecurityContextHolder.getContext()
    val auth = securityContext.authentication

    val userId = auth.principal as String

    return userRepository.findById(userId).get()
  }

  @Throws(JwtException::class)
  fun getUserIdFromJwt(tokenStr: String): String {
    return Jwts.parser()
        .setSigningKey(clientSecret)
        .parseClaimsJws(tokenStr)
        .body
        .subject
  }

  fun getUserFromUserInfo(userinfo: Userinfoplus): AuthTokenInfo {
    val user = userRepository.findByEmail(userinfo.email) ?: createNewUser(userinfo)

    val token = createJwt(user.id)

    return AuthTokenInfo(token, user.username)
  }

  private fun createNewUser(userinfo: Userinfoplus): User {
    val newUser = User(userinfo.name, "somePlaceholderPassword", userinfo.email)
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
