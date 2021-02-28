package altszama.config

import org.springdoc.core.GroupedOpenApi
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration


@Configuration
open class SwaggerConfig {

  @Bean
  fun frontendOpenApi(): GroupedOpenApi? {
    val frontendPackages = arrayOf(
        "altszama.app.dish",
        "altszama.app.order",
        "altszama.app.orderEntry",
        "altszama.app.restaurant",
        "altszama.app.team",
        "altszama.app.auth"
    )

    return GroupedOpenApi.builder()
        .group("frontend").packagesToScan(*frontendPackages)
        .build()
  }

  @Bean
  fun importOpenApi(): GroupedOpenApi? {
    val importPackages = arrayOf(
        "altszama.app.restaurantImport"
    )

    return GroupedOpenApi.builder()
        .group("import").packagesToScan(*importPackages)
        .build()
  }

//  @Bean
//  fun customOpenAPI(): OpenAPI? {
//    return OpenAPI().addServersItem(Server().url("http://localhost:8081/"))
//  }

}
