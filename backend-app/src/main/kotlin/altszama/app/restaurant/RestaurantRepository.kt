package altszama.app.restaurant;

import altszama.app.team.Team
import org.springframework.data.domain.Sort
import org.springframework.data.mongodb.repository.MongoRepository;

interface RestaurantRepository : MongoRepository<Restaurant, String> {
  fun findByTeamAndName(team: Team, name: String): Restaurant?
  fun findByTeamAndUrl(team: Team, url: String): Restaurant?
  fun findAllByTeam(team: Team, by: Sort): List<Restaurant>
}
