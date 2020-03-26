package altszama.app.auth;

import com.google.common.collect.Lists;
import org.springframework.security.authentication.AbstractAuthenticationToken;

class TokenBasedAuthentication(private val userId: String,
                               private val token: String) : AbstractAuthenticationToken(Lists.newArrayList()) {

  override fun getCredentials(): Any {
    return token
  }

  override fun getPrincipal(): Any {
    return userId
  }

  override fun isAuthenticated(): Boolean {
    return true
  }
}
