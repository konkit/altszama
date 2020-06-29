package altszama.app.activityLog

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class ActivityEventService {
    @Autowired
    private lateinit var repository: ActivityEventRepository

    fun saveUserLogin(userId: String) {
        repository.save(UserLoggedInEvent(userId))
    }
}