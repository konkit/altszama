package altszama.app.notification

import org.springframework.data.mongodb.repository.MongoRepository;


interface PushNotSubscriptionRepository : MongoRepository<PushNotifSubscription, String> {
  fun findByUserId(userId: String): PushNotifSubscription?
}
