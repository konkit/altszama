package altszama.app.auth;

import org.springframework.data.repository.Repository
import java.util.*

interface UserRepository : Repository<User, String> {
    fun findById(id: String): Optional<User>
    fun findByEmail(email: String): Optional<User>
    fun save(user: User)

    fun findAll(): List<User>
}
