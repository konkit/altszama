package altszama.app.auth

import io.jsonwebtoken.JwtException
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.filter.OncePerRequestFilter

class TokenAuthFilter : OncePerRequestFilter() {

  @Autowired
  private lateinit var userService: UserService

  @Override
  override fun doFilterInternal(request: HttpServletRequest, response: HttpServletResponse, filterChain: FilterChain) {
    try {
      val authToken = getToken(request)

      if (authToken != null) {
          val userId: String = userService.getUserIdFromJwt(authToken)

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
    val authHeader: String? = request.getHeader("Authorization")

    if (authHeader != null && authHeader.startsWith("Bearer ")) {
      return authHeader.substring(7)
    }

    return null
  }
}
