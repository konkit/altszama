package altszama.config

import altszama.app.notification.PushNotifSubscription
import altszama.app.order.Order
import altszama.app.orderEntry.OrderEntry
import altszama.app.restaurant.Restaurant
import altszama.app.team.Team
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Configuration
import org.springframework.data.mongodb.core.MongoOperations
import org.springframework.data.mongodb.core.index.IndexResolver
import javax.annotation.PostConstruct


@Configuration
open class DatabaseIndicesConfig() {

  @Autowired
  lateinit var operations: MongoOperations

  @PostConstruct
  private fun postConstruct() {
    val resolver = IndexResolver.create(operations.converter.mappingContext)

    val indexClasses = listOf(
      Team::class.java,
      Restaurant::class.java,
      Order::class.java,
      OrderEntry::class.java,
      PushNotifSubscription::class.java
    )

    indexClasses.forEach { klass ->
      resolver.resolveIndexFor(klass).forEach { operations.indexOps(klass).ensureIndex(it) }
    }
  }

}
