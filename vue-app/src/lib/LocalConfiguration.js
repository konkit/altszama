import { Configuration } from "@/frontend-client";
var LocalConfiguration = /** @class */ (function () {
    function LocalConfiguration(state) {
        this.state = state;
    }
    LocalConfiguration.prototype.createConfiguration = function () {
        var currentDomain = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
        var backendUrl = process.env.VUE_APP_BACKEND_URL2 || currentDomain;
        return new Configuration({
            basePath: backendUrl,
            accessToken: this.state.token || ""
        });
    };
    return LocalConfiguration;
}());
export default LocalConfiguration;
//# sourceMappingURL=LocalConfiguration.js.map