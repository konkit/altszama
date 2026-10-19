package altszama.app.notification

import altszama.app.test.AbstractIntegrationTest
import altszama.app.test.TestFactoriesService
import tools.jackson.databind.ObjectMapper
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers

class NotificationControllerSubscribeTest : AbstractIntegrationTest() {

  @Autowired
  private lateinit var mockMvc: MockMvc

  @Autowired
  private lateinit var objectMapper: ObjectMapper

  @Autowired
  private lateinit var testFactoriesService: TestFactoriesService

  @Autowired
  private lateinit var subscriberRepository: PushNotSubscriptionRepository

  @Test
  fun subscriptionsOfDifferentUsersShouldBeStoredSeparately() {
    val team1 = testFactoriesService.createTeam1()
    val (user1Token, user1) = testFactoriesService.createUser1WithToken(team1)
    val (user2Token, user2) = testFactoriesService.createUser2WithToken(team1)

    subscribe(user1Token, "https://push.example.com/user1")
    subscribe(user2Token, "https://push.example.com/user2")

    assertThat(subscriberRepository.findAll()).hasSize(2)
    assertThat(subscriberRepository.findByUserId(user1.id)!!.endpoint).isEqualTo("https://push.example.com/user1")
    assertThat(subscriberRepository.findByUserId(user2.id)!!.endpoint).isEqualTo("https://push.example.com/user2")
  }

  @Test
  fun subscribingAgainShouldUpdateTheUsersExistingSubscription() {
    val team1 = testFactoriesService.createTeam1()
    val (user1Token, user1) = testFactoriesService.createUser1WithToken(team1)

    subscribe(user1Token, "https://push.example.com/old")
    subscribe(user1Token, "https://push.example.com/new")

    assertThat(subscriberRepository.findAll()).hasSize(1)
    assertThat(subscriberRepository.findByUserId(user1.id)!!.endpoint).isEqualTo("https://push.example.com/new")
  }

  private fun subscribe(token: String, endpoint: String) {
    val body = PushNotifSubscriptionData(endpoint = endpoint, p256dhKey = "p256dh-key", authKey = "auth-key")

    val request = MockMvcRequestBuilders.post("/api/notification/subscribe")
      .header("Authorization", token)
      .contentType(MediaType.APPLICATION_JSON)
      .content(objectMapper.writeValueAsString(body))

    mockMvc.perform(request).andExpect(MockMvcResultMatchers.status().isOk)
  }
}
