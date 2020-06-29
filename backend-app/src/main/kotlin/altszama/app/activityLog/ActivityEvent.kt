package altszama.app.activityLog

interface ActivityEvent

data class UserLoggedInEvent(val userId: String): ActivityEvent