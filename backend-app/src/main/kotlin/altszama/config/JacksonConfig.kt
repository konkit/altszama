package altszama.config;

import org.springframework.boot.jackson.autoconfigure.JsonMapperBuilderCustomizer
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import tools.jackson.databind.cfg.DateTimeFeature


@Configuration
open class JacksonConfig {

  // Jackson 3 registers the Kotlin module by itself and has java.time support built in
  @Bean
  open fun jsonMapperCustomizer(): JsonMapperBuilderCustomizer {
    return JsonMapperBuilderCustomizer { builder ->
      builder.disable(DateTimeFeature.WRITE_DATES_AS_TIMESTAMPS)
    }
  }
}
