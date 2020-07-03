import LocalConfiguration from "@/lib/LocalConfiguration";
import {
  AllOrdersResponse,
  Configuration,
  CreateTeamDto,
  Function0Object,
  Team,
  TeamControllerApi
} from "@/frontend-client";
import {RootState} from "@/store";
import store from "@/store";


function headersWithToken() {
  return { headers: {'Authorization': 'Bearer ' + store.state.token } }
}


export default class TeamsApiConnector {
  private localConfiguration: LocalConfiguration;
  private configuration: Configuration;
  private readonly teamsApi: TeamControllerApi;

  constructor(rootState: RootState) {
    this.localConfiguration = new LocalConfiguration(rootState);
    this.configuration = this.localConfiguration.createConfiguration();
    this.teamsApi = new TeamControllerApi(this.configuration);
  }

  getAllTeams(): Promise<Team[]> {
    return this.teamsApi.getAll(headersWithToken())
  }

  getForUser(): Promise<Team[]> {
    return this.teamsApi.getForUser(headersWithToken())
  }

  createTeam(dto: CreateTeamDto): Promise<Response> {
    return this.teamsApi.createTeam(dto, headersWithToken());
  }

}