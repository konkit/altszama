package altszama.config

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Configuration


@Configuration
open class SecretsConfig {

    @Value("\${altszama.googleClientId}")
    lateinit var googleClientId: String

    @Value("\${altszama.googleClientSecret}")
    lateinit var googleClientSecret: String

    @Value("\${altszama.databaseName}")
    lateinit var databaseName: String

    @Value("\${altszama.gcmServerKey}")
    lateinit var gcmServerKey: String

}