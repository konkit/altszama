package altszama.config;

import altszama.app.auth.TokenAuthFilter
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpStatus
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.HttpStatusEntryPoint
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter


@Configuration
@EnableWebSecurity
class WebSecurityConfig {

  val permittedPaths = arrayOf(
    "/api/",
    "/api/home",
    "/api/login*",
    "/api/signin/**",
    "/api/signup/**",
    "/api/register/**",
    "/api/static/**",
    "/api/manifest.*.json",
    "/api/sw.js",
    "/api/webjars/**",
    "/api/restaurantImport/**",
    "/api/restaurantImportFromPayload/**",
    "/api/auth/**",
    "/api/__webpack_hmr",
    "/api/static2/index.html",
    "/api/static/index.html",
    "/api/index.html",
    "/api/service-worker.js",
    "/api/notification/**",
    "/api/custom-service-worker.js",
    "/api/app.js",
    "/api/favicon.ico",
    "/v3/api-docs/**",
    "/api/swagger-ui/**",
    "/api/swagger-ui.html",
    "/api/swagger/**",
    "/api/e2e/**",
    "/api/frontendConfig",
    "/api/sentry",
    "/actuator/**"
  )

  @Bean
  fun filterChain(http: HttpSecurity): SecurityFilterChain? {

    http
      .csrf().disable()
      .cors().disable()
      .authorizeHttpRequests { auth ->
        auth
          .requestMatchers(*permittedPaths).permitAll()
          .anyRequest().authenticated()
          .and()
          .exceptionHandling()
          .authenticationEntryPoint(HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
          .and()
          .logout().permitAll()
          .and()
          .addFilterBefore(jwtAuthenticationTokenFilter(), BasicAuthenticationFilter::class.java)
      }
    return http.build()
  }

    @Bean
    fun jwtAuthenticationTokenFilter(): TokenAuthFilter {
        return TokenAuthFilter()
    }
}
