package altszama.app.notification;

import altszama.app.auth.UserService;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import javax.validation.constraints.NotNull

data class PushNotifSubscriptionData(
    @NotNull
    var endpoint: String = "",

    @NotNull
    var p256dhKey: String = "",

    @NotNull
    var authKey: String = ""
)


@RestController
@RequestMapping("/api")
class NotificationController {

  @Autowired
  private lateinit var subscriberRepository: PushNotSubscriptionRepository

  @Autowired
  private lateinit var userService: UserService

  private val logger = LoggerFactory.getLogger(NotificationController::class.java)

  @PostMapping("/notification/subscribe")
  fun addSubscriber(@RequestBody subscriberParams: PushNotifSubscriptionData): String {
    val currentUser = userService.currentUser()

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

    return "{}"
  }

  @DeleteMapping("/notification/unsubscribe")
  fun removeSubscriber(): String {
    val currentUser = userService.currentUser()

    val subscr = subscriberRepository.findByUserId(currentUser.id)
    if (subscr != null) {
      subscriberRepository.delete(subscr)
    }

    return "{}"
  }
}
