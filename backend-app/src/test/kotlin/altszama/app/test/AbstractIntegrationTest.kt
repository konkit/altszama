package altszama.app.test

import altszama.app.TestInitializer
import altszama.app.auth.UserService
import com.mongodb.BasicDBObject
import org.junit.jupiter.api.BeforeEach
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.data.mongodb.core.MongoTemplate
import org.springframework.test.context.ContextConfiguration


@SpringBootTest(properties = ["spring.main.allow-bean-definition-overriding=true"])
@AutoConfigureMockMvc
@ContextConfiguration(initializers = [TestInitializer::class])
open class AbstractIntegrationTest() {

  @Autowired
  private lateinit var mongoTemplate: MongoTemplate

  @Autowired
  private lateinit var userService: UserService

  @BeforeEach
  fun beforeEach() {
    for (collectionName in mongoTemplate.collectionNames) {
      if (!collectionName.startsWith("system.")) {
        mongoTemplate.getCollection(collectionName).deleteMany(BasicDBObject())
      }
    }
  }

  protected fun createUserAndGetToken(username: String, email: String): String {
    return "Bearer ${userService.createJwtTokenFromUserInfo(username, email).token}"
  }

}
