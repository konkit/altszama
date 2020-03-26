package altszama.config;

import altszama.app.auth.TokenAuthFilter;
import com.google.common.collect.ImmutableList;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.HttpStatusEntryPoint
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;


@Configuration
@EnableWebSecurity
class WebSecurityConfig : WebSecurityConfigurerAdapter() {

    override fun configure(httpSecurity: HttpSecurity) {
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
                "/api/favicon.ico"
        )

        httpSecurity
                .csrf().disable()
                .cors().and()
                .authorizeRequests()
                .antMatchers(*permittedPaths).permitAll()
                .anyRequest().authenticated()
                .and()
                .exceptionHandling()
                .authenticationEntryPoint(HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)).and()
                .logout().permitAll().and()
                .addFilterBefore(jwtAuthenticationTokenFilter(), BasicAuthenticationFilter::class.java)
    }

    @Bean
    fun jwtAuthenticationTokenFilter(): TokenAuthFilter {
        return TokenAuthFilter()
    }

    @Bean
    fun encoder(): PasswordEncoder {
        return BCryptPasswordEncoder(11)
    }

    @Bean
    fun corsConfigurationSource(): CorsConfigurationSource {
        val configuration = CorsConfiguration()
        configuration.allowedOrigins = ImmutableList.of("*")
        configuration.allowedMethods = ImmutableList.of("HEAD", "GET", "POST", "PUT", "DELETE", "PATCH")

        // setAllowCredentials(true) is important, otherwise:
        // The value of the 'Access-Control-Allow-Origin' header in the response must not be the wildcard '*' when the request's credentials mode is 'include'.
        configuration.allowCredentials = true

        // setAllowedHeaders is important! Without it, OPTIONS preflight request
        // will fail with 403 Invalid CORS request
        configuration.allowedHeaders = ImmutableList.of("Authorization", "Cache-Control", "Content-Type")

        val source = UrlBasedCorsConfigurationSource()
        source.registerCorsConfiguration("/**", configuration)

        return source
    }
}