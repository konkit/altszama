package altszama.notification

import altszama.order.Order
import altszama.orderEntry.OrderEntryRepository
import altszama.auth.User
import nl.martijndwars.webpush.Notification
import nl.martijndwars.webpush.PushService
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service


@Service
class NotificationService {

  private val logger: Logger = LoggerFactory.getLogger(NotificationService::class.java)

  @Autowired
  private lateinit var subscriberRepository: PushNotSubscriptionRepository

  @Autowired
  private lateinit var orderEntryRepository: OrderEntryRepository

  @Value("\${gcmServerKey}")
  private lateinit var serverKey: String

  private val TTL = 255


  fun notificateOrdered(order: Order, eta: String) {
    logger.info(String.format("Order %s ordered", order.id))
    sendMessage(findInvolvedUsers(order), String.format("Your order from %s is ordered, ETA: %s.", order.restaurant.name, eta))
  }

  fun notificateDelivered(order: Order) {
    logger.info(String.format("Order %s delivered", order.id))
    sendMessage(findInvolvedUsers(order), String.format("Your order from %s is delivered.", order.restaurant.name))
  }

  fun notificateRejected(order: Order) {
    logger.info(String.format("Order %s rejected", order.id))
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
      val notification: Notification
      val pushService: PushService

      if (useGcm(sub.endpoint)) {
        notification = Notification(
          sub.endpoint,
          sub.getUserPublicKey(),
          sub.getAuthKeyAsBytes(),
          payload,
          TTL
        )

        pushService = PushService(serverKey)
      } else {
        notification = Notification(
          sub.endpoint,
          sub.getUserPublicKey(),
          sub.getAuthKeyAsBytes(),
          payload
        )

        pushService = PushService()
      }

      pushService.send(notification)
    } catch (e: Exception) {
      throw RuntimeException("Error sending notification", e)
    }
  }

  private fun useGcm(endpoint: String): Boolean {
    return endpoint.indexOf("https://android.googleapis.com/gcm/send") == 0
  }

  private fun findInvolvedUsers(order: Order): List<User> {
    return orderEntryRepository.findByOrderId(order.id)
        .map { orderEntry -> orderEntry.user }
  }
}
