import {Configuration} from "@/frontend-client";
import {CURRENT_DOMAIN} from "@/lib/config";
import store from "@/store";


export abstract class AbstractApiConnector {

  createConfiguration() {
    return new Configuration({
      basePath: CURRENT_DOMAIN,
    });
  }

  headersWithToken() {
    return { headers: { Authorization: "Bearer " + store.state.token } };
  }

}
