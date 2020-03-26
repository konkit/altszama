package altszama.notification;

import altszama.auth.AuthService;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
class NotificationController {

  @Autowired
  private lateinit var subscriberRepository: PushNotSubscriptionRepository

  @Autowired
  private lateinit var authService: AuthService

  private val logger = LoggerFactory.getLogger(NotificationController::class.java)

  @RequestMapping("/notification/subscribe")
  fun addSubscriber(@RequestBody subscriberParams: PushNotifSubscription): String {
    val currentUser = authService.currentUser()

    if (currentUser != null) {
      val currentSubscriber = subscriberRepository.findByUserId(currentUser.id)
          ?: PushNotifSubscription()

      currentSubscriber.authKey = subscriberParams.authKey
      currentSubscriber.endpoint = subscriberParams.endpoint
      currentSubscriber.p256dhKey = subscriberParams.p256dhKey
      currentSubscriber.userId = currentUser.id

      subscriberRepository.save(currentSubscriber)

      logger.info("Subscriber added - " + subscriberParams)
    } else {
      logger.info("User not authenticated, subscription not added")
    }

    return "OK"
  }

  @RequestMapping("/notification/unsubscribe/}")
  fun removeSubscriber(): String {
    val currentUser = authService.currentUser()

    val subscr = subscriberRepository.findByUserId(currentUser.id)
    if (subscr != null) {
      subscriberRepository.delete(subscr)
    }

    return "OK"
  }
}
