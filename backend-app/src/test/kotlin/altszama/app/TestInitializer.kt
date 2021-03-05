package altszama.app

import org.springframework.boot.test.util.TestPropertyValues
import org.springframework.context.ApplicationContextInitializer
import org.springframework.context.ConfigurableApplicationContext


open class TestInitializer : ApplicationContextInitializer<ConfigurableApplicationContext> {

  override fun initialize(ctx: ConfigurableApplicationContext) {
    TestPropertyValues.of(
        "JWT_SIGNING_KEY:some-key",
        "DATABASE_NAME:test-altszama",
        "DATABASE_HOST:localhost",
        "DATABASE_PORT:27017",
        "GOOGLE_CLIENT_ID:googleKey",
        "GOOGLE_CLIENT_SECRET:googleSecret",
        "VAPID_PRIVATE_KEY:vapidPrivateKey",
        "VAPID_PUBLIC_KEY:vapidPublicKey",
        "VAPID_SUBJECT:vapidSubject"
    ).applyTo(ctx)
  }
}
