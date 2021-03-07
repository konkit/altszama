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
    } else if (errorResponse.status === 500) {
      store.commit("addError", {message: "Internal error occured, please try again or contact the administrator."})
    } else {
      errorResponse.json().then((body: unknown) => store.commit("addError", body))
    }
  }
}


