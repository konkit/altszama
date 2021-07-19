package altszama.app.sentry

import com.google.gson.JsonElement
import com.google.gson.JsonParser
import org.springframework.http.HttpEntity
import org.springframework.http.HttpMethod
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseBody
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.client.RestTemplate
import java.net.URI
import java.net.URISyntaxException
import javax.servlet.http.HttpServletRequest

// https://docs.sentry.io/platforms/javascript/troubleshooting/#dealing-with-ad-blockers
@RestController
@RequestMapping("/api/sentry")
class SentryTunnelController {

  @RequestMapping("/**")
  @ResponseBody
  @Throws(URISyntaxException::class)
  fun mirrorRest(@RequestBody body: String?, method: HttpMethod?, request: HttpServletRequest): String? {
    val sentryUrl = getSentryUrl(body)

    val restTemplate = RestTemplate()
    val responseEntity: ResponseEntity<String> = restTemplate.exchange(
      sentryUrl, method ?: HttpMethod.POST, HttpEntity(body ?: "{}"),
      String::class.java
    )
    return responseEntity.body
  }

  private fun getSentryUrl(body: String?): String {
    val jsonElement: JsonElement = JsonParser.parseString(body?.lines()?.first() ?: "{}")
    val jsonObject = jsonElement.asJsonObject

    val dsn = jsonObject["dsn"].asString

    val dsnUri = URI(dsn)

    val projectId = dsnUri.path.replace("/", "")
    return "https://${dsnUri.host}/api/${projectId}/envelope/"
  }

}
