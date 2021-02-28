package altszama.app.team

import org.springframework.data.annotation.Id

data class Team(@Id var id: String, var domain: String, var users: List<String>)
