package altszama.app.frontendConfig

import altszama.config.SecretsConfig
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

data class FrontendConfig(val googleClientId: String, val vapidPublicKey: String, val sentryUrl: String)

@RestController
class FrontendConfigController {

  @Autowired
  private lateinit var secretsConfig: SecretsConfig

  @GetMapping("/api/frontendConfig")
  fun getConfig(): FrontendConfig {
    return FrontendConfig(secretsConfig.googleClientId, secretsConfig.vapidPublicKey, secretsConfig.sentryUrl)
  }

}