package altszama.app.activityLog

import org.springframework.data.mongodb.repository.MongoRepository

interface ActivityEventRepository : MongoRepository<ActivityEvent, String> {

}