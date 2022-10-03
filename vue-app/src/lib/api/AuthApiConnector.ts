import store from "@/store";
import router from "@/router";
import {AuthControllerApi, GooglePayload} from "@/frontend-client";
import {AbstractApiConnector} from "@/lib/api/AbstractApiConnector";


export default class AuthApiConnector extends AbstractApiConnector {

  private readonly authControllerApi: AuthControllerApi;

  constructor() {
    super()
    this.authControllerApi = new AuthControllerApi(this.createConfiguration());
  }

  loginWithGoogle(googlePayload: GooglePayload, returnPath = ""): Promise<void> {
    return new Promise((resolve, reject) => {
      return this.authControllerApi.loginWithReceivedJwt(googlePayload)
        .then(
          response => {
            store.commit("loginUser", {
              username: response.userInfo.username,
              token: response.userInfo.token
            });

            if (returnPath.length > 0) {
              router.push({path: returnPath});
            } else {
              router.push({name: "TodayOrders"});
            }

            resolve();
          },
          errorResponse => {
            try {
              errorResponse.json().then((error: unknown) => reject(error), (error: unknown) => reject(error))
            } catch {
              errorResponse.text().then((error: unknown) => reject(error), (error: unknown) => reject(error))
            }
          }
        );
    });
  }
}


