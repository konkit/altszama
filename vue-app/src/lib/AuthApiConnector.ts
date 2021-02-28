import store, {RootState} from "../store";
import router from "../router";
import GoogleLogin from "./GoogleLogin";
import {AuthControllerApi, Configuration} from "@/frontend-client";
import LocalConfiguration from "@/lib/LocalConfiguration";

export default class AuthApiConnector {

  private localConfiguration: LocalConfiguration;
  private configuration: Configuration;
  private readonly authControllerApi: AuthControllerApi;

  constructor(rootState: RootState) {
    this.localConfiguration = new LocalConfiguration(rootState);
    this.configuration = this.localConfiguration.createConfiguration();
    this.authControllerApi = new AuthControllerApi(this.configuration);
  }

  loginWithGoogle(returnPath = "") {
    return new Promise((resolve, reject) => {
      GoogleLogin.signIn()
        .then(authCode => {
          this.authControllerApi.loginWithIdToken(authCode)
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
                errorResponse.json().then((error: unknown) => reject(error))
              }
            );
        });
    });
  }

  doLogout() {
    store.commit("logoutUser");
    const signOutCallback = () => router.push({name: "Login"});
    GoogleLogin.signOut(signOutCallback, signOutCallback);
  }

  setPushNotificationEnabled(newVal: boolean) {
    store.commit("setPushNotificationEnabled", newVal)
  }
}


