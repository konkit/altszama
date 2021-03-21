import store from "@/store";
import router from "@/router";
import GoogleLogin from "@/lib/GoogleLogin";
import {AuthControllerApi} from "@/frontend-client";
import {AbstractApiConnector} from "@/lib/api/AbstractApiConnector";


export default class AuthApiConnector extends AbstractApiConnector {

  private readonly authControllerApi: AuthControllerApi;

  constructor() {
    super()
    this.authControllerApi = new AuthControllerApi(this.createConfiguration());
  }

  loginWithGoogle(returnPath = ""): Promise<void> {
    return new Promise((resolve, reject) => {
      GoogleLogin.signIn()
        .then(
          authCode => {
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
          },
          err => {
            console.log("Google login sign in error: ", err)
            reject()
          }
        )
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


