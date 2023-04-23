package altszama.config;

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.datatype.jdk8.Jdk8Module
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.fasterxml.jackson.module.kotlin.registerKotlinModule
import com.fasterxml.jackson.module.paramnames.ParameterNamesModule
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Primary
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder


@Configuration
open class JacksonConfig {

  @Bean
  @Primary
  open fun objectMapper(builder: Jackson2ObjectMapperBuilder): ObjectMapper {
    val objectMapper = builder.createXmlMapper(false).build<ObjectMapper>()

    objectMapper.registerKotlinModule()
    objectMapper.registerModule(ParameterNamesModule())
    objectMapper.registerModule(Jdk8Module())
    objectMapper.registerModule(JavaTimeModule())

    objectMapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false)

    return objectMapper
  }
}
