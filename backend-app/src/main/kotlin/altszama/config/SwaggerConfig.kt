package altszama.config

import altszama.app.restaurantImport.RestaurantImport
import io.swagger.v3.oas.models.Components
import io.swagger.v3.oas.models.OpenAPI
import io.swagger.v3.oas.models.info.Info
import io.swagger.v3.oas.models.security.SecurityRequirement
import io.swagger.v3.oas.models.security.SecurityScheme
import io.swagger.v3.oas.models.servers.Server
import org.springdoc.core.GroupedOpenApi
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Profile
import org.springframework.core.env.Environment


@Configuration
open class SwaggerConfig {

  @Autowired
  private lateinit var environment: Environment

  @Autowired
  private lateinit var secretsConfig: SecretsConfig

  @Bean
  fun customOpenAPI(): OpenAPI? {
    val importApiSecurityScheme = SecurityScheme()
      .type(SecurityScheme.Type.APIKEY)
      .`in`(SecurityScheme.In.HEADER)
      .name(RestaurantImport.headerName)

    val guiApiSecurityScheme = SecurityScheme()
      .type(SecurityScheme.Type.APIKEY)
      .scheme("bearer")
      .bearerFormat("JWT")

    val components = Components()
      .addSecuritySchemes("ImportApiKeyAuth", importApiSecurityScheme)

    if (environment.activeProfiles.contains("development")) {
      components.addSecuritySchemes("GuiApiAuth", guiApiSecurityScheme)
    }

    val description = "To use the API please use the Import API Key specified on \"Restaurants\" page"

    return OpenAPI()
        .addServersItem(Server().url(secretsConfig.backendUrl))
        .components(components)
        .info(Info().title("Restaurant Import API").description(description))
        .addSecurityItem(SecurityRequirement().addList("bearerAuth", listOf()));
  }

  @Bean
  @Profile("development")
  fun frontendOpenApi(): GroupedOpenApi? {
    val frontendPackages = arrayOf(
        "altszama.app.dish",
        "altszama.app.order",
        "altszama.app.orderEntry",
        "altszama.app.restaurant",
        "altszama.app.team",
        "altszama.app.auth",
        "altszama.app.notification",
        "altszama.app.balance",
        "altszama.app.e2e"
    )

    return GroupedOpenApi.builder()
        .group("frontend")
        .packagesToScan(*frontendPackages)
        .build()
  }

  @Bean
  fun importOpenApi(): GroupedOpenApi? {
    val importPackages = arrayOf(
        "altszama.app.restaurantImport"
    )

    return GroupedOpenApi.builder()
        .group("import")
        .packagesToScan(*importPackages)
        .build()
  }

}
