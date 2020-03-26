package altszama.config

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.data.mongodb.MongoDbFactory
import org.springframework.data.mongodb.core.MongoClientFactoryBean
import org.springframework.data.mongodb.core.SimpleMongoClientDbFactory


@Configuration
open class DatabaseConfig() {

    @Autowired
    lateinit var envVarConfig: SecretsConfig

    /*
     * Factory bean that creates the com.mongodb.Mongo instance
     */
    @Bean
    fun mongo(): MongoClientFactoryBean? {
        val databaseHost = if (envVarConfig.databaseHost.isNullOrBlank())  "127.0.0.1" else envVarConfig.databaseHost
        val mongoPort = envVarConfig.databasePort.toIntOrNull() ?: 27017

        val mongo = MongoClientFactoryBean()
        mongo.setHost(databaseHost)
        mongo.setPort(mongoPort)
        return mongo
    }

//    @Bean
//    fun mongoDbFactory(): MongoDbFactory {
//        val databaseHost = if (envVarConfig.databaseHost.isNullOrBlank())  "127.0.0.1" else envVarConfig.databaseHost
//        val mongoPort = envVarConfig.databasePort.toIntOrNull() ?: 27017
//
//        return SimpleMongoClientDbFactory(mongoClient, envVarConfig.databaseName)
//    }
}