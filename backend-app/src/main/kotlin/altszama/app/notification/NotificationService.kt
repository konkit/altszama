package altszama.app.notification

import altszama.app.order.Order
import altszama.app.orderEntry.OrderEntryRepository
import altszama.app.auth.User
import altszama.config.SecretsConfig
import nl.martijndwars.webpush.Notification
import nl.martijndwars.webpush.PushService
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service


@Service
class NotificationService(val secretsConfig: SecretsConfig) {

  private val logger: Logger = LoggerFactory.getLogger(NotificationService::class.java)

  @Autowired
  private lateinit var subscriberRepository: PushNotSubscriptionRepository

  @Autowired
  private lateinit var orderEntryRepository: OrderEntryRepository


  fun notificateOrdered(order: Order, eta: String) {
    logger.info(String.format("Sending push notification about order %s being ordered", order.id))
    sendMessage(findInvolvedUsers(order), String.format("Your order from %s is ordered, ETA: %s.", order.restaurant.name, eta))
  }

  fun notificateDelivered(order: Order) {
    logger.info(String.format("Sending push notification about order %s being delivered", order.id))
    sendMessage(findInvolvedUsers(order), String.format("Your order from %s is delivered.", order.restaurant.name))
  }

  fun notificateRejected(order: Order) {
    logger.info(String.format("Sending push notification about order %s being rejected", order.id))
    sendMessage(findInvolvedUsers(order), String.format("Your order from %s is rejected.", order.restaurant.name))
  }

  fun sendMessage(receivingUsers: List<User>, message: String) {
    receivingUsers
        .mapNotNull { user -> subscriberRepository.findByUserId(user.id) }
        .forEach { subscriber ->
          logger.info(String.format("Sending notification to user %s", subscriber.userId))
          sendPushMessage(subscriber, message.toByteArray())
        }
  }

  private fun sendPushMessage(sub: PushNotifSubscription, payload: ByteArray) {
    try {
      val notification = Notification(
        sub.endpoint,
        sub.getUserPublicKey(),
        sub.getAuthKeyAsBytes(),
        payload
      )

      val pushService = PushService(
              this.secretsConfig.vapidPublicKey,
              this.secretsConfig.vapidPrivateKey, 
              this.secretsConfig.vapidSubject
      )

      val result = pushService.send(notification)

      logger.info("Push Notification response : ${result}")
    } catch (e: Exception) {
      throw RuntimeException("Error sending notification", e)
    }
  }

  private fun findInvolvedUsers(order: Order): List<User> {
    return orderEntryRepository.findByOrderId(order.id)
        .map { orderEntry -> orderEntry.user }
  }
}
