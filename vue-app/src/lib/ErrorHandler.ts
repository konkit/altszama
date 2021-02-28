import store from "../store";
import router from "../router";
import GoogleLogin from "./GoogleLogin";

export default class ErrorHandler {
  static handleError(errorResponse: any) {
    console.log(errorResponse);

    if (errorResponse.status === 401) {
      const fullRoutePath = router.currentRoute.fullPath;

      store.commit("logoutUser");
      store.commit("setPushNotificationEnabled", false);

      const signOutCallback =
        () => router.push({name: "Login", query: {returnPath: fullRoutePath}});

      GoogleLogin.signOut(signOutCallback, signOutCallback);
    } else {
      errorResponse.json().then((body: unknown) => store.commit("addError", body))
    }
  }
}


