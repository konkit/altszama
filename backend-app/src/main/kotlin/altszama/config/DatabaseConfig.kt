package altszama.config

import com.mongodb.MongoClient
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.data.mongodb.MongoDbFactory
import org.springframework.data.mongodb.core.SimpleMongoDbFactory


@Configuration
open class DatabaseConfig() {

    @Autowired
    lateinit var envVarConfig: SecretsConfig

    @Bean
    fun mongoDbFactory(): MongoDbFactory {
        return SimpleMongoDbFactory(MongoClient(), envVarConfig.databaseName)
    }
}