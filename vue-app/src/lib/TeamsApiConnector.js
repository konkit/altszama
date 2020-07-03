import LocalConfiguration from "@/lib/LocalConfiguration";
import { TeamControllerApi } from "@/frontend-client";
import store from "@/store";
function headersWithToken() {
    return { headers: { 'Authorization': 'Bearer ' + store.state.token } };
}
var TeamsApiConnector = /** @class */ (function () {
    function TeamsApiConnector(rootState) {
        this.localConfiguration = new LocalConfiguration(rootState);
        this.configuration = this.localConfiguration.createConfiguration();
        this.teamsApi = new TeamControllerApi(this.configuration);
    }
    TeamsApiConnector.prototype.getAllTeams = function () {
        return this.teamsApi.getAll(headersWithToken());
    };
    TeamsApiConnector.prototype.getForUser = function () {
        return this.teamsApi.getForUser(headersWithToken());
    };
    TeamsApiConnector.prototype.createTeam = function (dto) {
        return this.teamsApi.createTeam(dto, headersWithToken());
    };
    return TeamsApiConnector;
}());
export default TeamsApiConnector;
//# sourceMappingURL=TeamsApiConnector.js.map