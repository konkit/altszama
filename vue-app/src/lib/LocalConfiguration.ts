import {Configuration} from "@/frontend-client";
import store, {RootState} from "@/store";
import {Store} from "vuex";

export default class LocalConfiguration {

  private state: RootState;

  constructor(state: RootState) {
    this.state = state;
  }

  createConfiguration() {
    const currentDomain = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
    const backendUrl = process.env.VUE_APP_BACKEND_URL2 || currentDomain;

    return new Configuration({
      basePath: backendUrl,
      accessToken: this.state.token || ""
    });
  }
}