import store from "../store";
import router from "../router";

export default class ErrorHandler {
  static handleError(errorResponse: any) {
    console.log(errorResponse);

    if (errorResponse.status === 401) {
      const fullRoutePath = router.currentRoute.fullPath;

      store.commit("logoutUser");
      store.commit("setPushNotificationEnabled", false);

      router.push({name: "Login", query: {returnPath: fullRoutePath}});
    } else if (errorResponse.status === 500) {
      console.error(errorResponse)
      store.commit("addError", {message: "Internal error occured, please try again or contact the administrator."})
    } else if (typeof errorResponse.json === "function") {
      errorResponse.json().then((body: unknown) => store.commit("addError", body))
    } else {
      console.error(errorResponse)
      store.commit("addError", {message: "Internal error occured, please try again or contact the administrator."})
    }
  }
}


