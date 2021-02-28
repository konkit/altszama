import Vue from "vue";
import store, {RootState} from "../store";
import router from "../router";
import GoogleLogin from "./GoogleLogin";
import {BACKEND_URL} from "@/lib/config";
import {AuthControllerApi, Configuration, OrderControllerApi, OrderEntryControllerApi} from "@/frontend-client";
import LocalConfiguration from "@/lib/LocalConfiguration";

function headersWithToken(token: string) {
  return {headers: {Authorization: "Bearer " + token}};
}

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


