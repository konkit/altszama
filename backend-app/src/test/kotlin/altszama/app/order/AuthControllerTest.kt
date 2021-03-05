package altszama.app.order

import altszama.app.TestInitializer
import altszama.app.auth.UserService
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.junit.runner.RunWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.ContextConfiguration
import org.springframework.test.context.junit4.SpringRunner
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status


@RunWith(SpringRunner::class)
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
    val request = post("/api/auth/googleLogin/authorizationCode?authCode=wrongAuthCode").content("{}")

    val response = mockMvc.perform(request)
        .andExpect(status().isBadRequest)
        .andReturn()
        .response.contentAsString

    assertThat(response).isEqualTo("""{"message":"Couldn't fetch access token"}""")
  }
}
