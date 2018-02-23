package altszama.auth

import io.jsonwebtoken.JwtException
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.filter.OncePerRequestFilter
import javax.servlet.FilterChain
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

class TokenAuthFilter : OncePerRequestFilter() {

  private val AuthHeader = "Authorization"

  @Autowired
  private lateinit var authService: AuthService


  @Override
  override fun doFilterInternal(request: HttpServletRequest, response: HttpServletResponse, filterChain: FilterChain) {
    try {

      val authToken = getToken(request)

      if (authToken != null) {
          val userId: String = authService.getUserIdFromJwt(authToken)

          val authentication = TokenBasedAuthentication(userId, authToken)
          SecurityContextHolder.getContext().authentication = authentication
      } else {
        SecurityContextHolder.getContext().authentication = null
      }

      filterChain.doFilter(request, response)

    } catch (e: JwtException) {
      response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "The token is no longer valid.")
      SecurityContextHolder.getContext().authentication = null
    }
  }

  private fun getToken(request: HttpServletRequest): String? {
    val authHeader: String? = request.getHeader(AuthHeader)

    if (authHeader != null && authHeader.startsWith("Bearer ")) {
      return authHeader.substring(7)
    }

    return null
  }
}
