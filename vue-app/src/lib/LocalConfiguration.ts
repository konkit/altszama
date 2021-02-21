import {Configuration} from "@/frontend-client";
import {RootState} from "@/store";
import {CURRENT_DOMAIN} from "@/lib/config";

export default class LocalConfiguration {
  private state: RootState;

  constructor(state: RootState) {
    this.state = state;
  }

  createConfiguration() {
    return new Configuration({
      basePath: CURRENT_DOMAIN,
      accessToken: this.state.token || ""
    });
  }
}
