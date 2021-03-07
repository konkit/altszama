package altszama.app.restaurant;

import altszama.app.team.Team
import org.springframework.data.mongodb.repository.MongoRepository;

interface RestaurantRepository : MongoRepository<Restaurant, String> {
  fun findByName(name: String): Restaurant?

  fun findByUrl(url: String): Restaurant?
  fun findByTeamAndName(team: Team, name: String): Restaurant?
  fun findByTeamAndUrl(team: Team, url: String): Restaurant?
}
