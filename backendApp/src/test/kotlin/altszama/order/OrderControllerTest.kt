package altszama.order

import altszama.Application
import altszama.auth.AuthService
import altszama.auth.User
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import org.bson.types.ObjectId
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.mockito.Matchers
import org.mockito.Mockito
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.http.MediaType
import org.springframework.test.context.TestPropertySource
import org.springframework.test.context.junit4.SpringRunner
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.content
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import java.util.*


@RunWith(SpringRunner::class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = arrayOf(Application::class))
@AutoConfigureMockMvc()
@TestPropertySource(properties = arrayOf("googleClientId=qwerty", "googleClientSecret=qwerty", "gcmServerKey=qwerty"))
class OrderControllerTest {

  @Autowired
  private lateinit var mockMvc: MockMvc

  @MockBean
  private lateinit var authService: AuthService

  private val userId = ObjectId.get().toHexString()
  private val jwt = testJwt(userId)

  @Before
  fun setup() {
    setupMocks()
  }

  @Test
  fun displayIndex() {
    val request = get("/orders.json")
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", "Bearer " + jwt)

    mockMvc.perform(request)
        .andExpect(status().isOk)
        .andExpect(content()
            .contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
  }


  private fun setupMocks() {
    val user = User("username", "password", "mail@mail.com")
    user.id = userId

    Mockito.`when`(authService.getUserIdFromJwt(Matchers.anyString())).thenReturn(userId)
    Mockito.`when`(authService.createJwt(Matchers.anyString())).thenReturn(jwt)
    Mockito.`when`(authService.currentUser()).thenReturn(user)
  }

  private fun testJwt(userId: String): String? {
    return Jwts.builder()
        .setSubject(userId)
        .setExpiration(Date(System.currentTimeMillis() + 864_000_000))
        .signWith(SignatureAlgorithm.HS512, "qwerty")
        .compact()
  }
}