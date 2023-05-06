package altszama.app.auth

import altszama.app.TestInitializer
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.MediaType
import org.springframework.test.context.ContextConfiguration
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status


@SpringBootTest(properties = arrayOf("spring.main.allow-bean-definition-overriding=true"))
@AutoConfigureMockMvc
@ContextConfiguration(initializers = arrayOf(TestInitializer::class))
open class AuthControllerTest() {

  @Autowired
  private lateinit var mockMvc: MockMvc

  @Test
  fun shouldNotAllowAccessToUnauthenticatedUsers() {
    val request = get("/api/orders/today.json")

    val response = mockMvc.perform(request)
        .andExpect(status().isUnauthorized)
        .andReturn()
        .response.contentAsString

    assertThat(response).isEqualTo("")
  }

  @Test
  fun shouldReturnBadRequestIfTheCodeWasNotSupplied() {
    val request = post("/api/auth/googleLogin/authorizationCode")

    val response = mockMvc.perform(request)
        .andExpect(status().isBadRequest)
        .andReturn()
        .response.contentAsString

    assertThat(response).isEqualTo("")
  }

  @Test
  fun shouldReturnBadRequestIfTheAuthCodeWasWrong() {
    val payload = """{
      "credential": "fakeCredential",
      "clientId": "wrongClientId",
      "select_by": "wrongValueToo"
    }""".trimIndent()
    val request = post("/api/auth/googleLogin/authorizationCode")
      .content(payload)
      .contentType(MediaType.APPLICATION_JSON_VALUE)

    val response = mockMvc.perform(request)
        .andExpect(status().isBadRequest)
        .andReturn()
        .response.contentAsString

    assertThat(response).isEqualTo("""{"message":"Couldn't verify Google Sign-in token"}""")
  }
}
