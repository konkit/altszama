package altszama.config

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Configuration


@Configuration
open class SecretsConfig {

    @Value("#{environment.DATABASE_HOST}")
    lateinit var databaseHost: String

    @Value("#{environment.DATABASE_NAME}")
    lateinit var databaseName: String

    @Value("#{environment.DATABASE_PORT}")
    lateinit var databasePort: String

    @Value("#{environment.GOOGLE_CLIENT_ID}")
    lateinit var googleClientId: String

    @Value("#{environment.GOOGLE_CLIENT_SECRET}")
    lateinit var googleClientSecret: String

    @Value("#{environment.ORIGIN_URL}")
    lateinit var backendUrl: String

    @Value("#{environment.VAPID_PUBLIC_KEY}")
    lateinit var vapidPublicKey: String

    @Value("#{environment.VAPID_PRIVATE_KEY}")
    lateinit var vapidPrivateKey: String

    @Value("#{environment.VAPID_SUBJECT}")
    lateinit var vapidSubject: String

    @Value("#{environment.SENTRY_URL}")
    lateinit var sentryUrl: String

}
