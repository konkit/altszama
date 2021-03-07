package altszama.config

import com.mongodb.client.MongoClient
import com.mongodb.client.MongoClients
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.data.mongodb.core.MongoTemplate


@Configuration
open class DatabaseConfig() {

    @Autowired
    lateinit var envVarConfig: SecretsConfig

    @Bean
    fun mongoClient(): MongoClient {
        return MongoClients.create(getMongoConnectionString())
    }

    @Bean
    fun mongoTemplate(): MongoTemplate? {
        val mongoDatabase = envVarConfig.databaseName
        return MongoTemplate(mongoClient(), mongoDatabase)
    }

    private fun getMongoConnectionString(): String {
        val databaseHost = if (envVarConfig.databaseHost.isNullOrBlank()) "127.0.0.1" else envVarConfig.databaseHost
        val mongoPort = envVarConfig.databasePort.toIntOrNull() ?: 27017

        return "mongodb://${databaseHost}:${mongoPort}"
    }

}
