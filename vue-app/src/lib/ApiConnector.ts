import Vue from "vue";
import store from "../store";
import router from "../router";
import GoogleLogin from "./GoogleLogin";
import {BACKEND_URL} from "@/lib/config";

let pushNotificationEnabled = false;

function headersWithToken(token: string) {
  return {headers: {Authorization: "Bearer " + token}};
}

function doLogout() {
  store.commit("logoutUser");

  pushNotificationEnabled = false;

  const signOutCallback = () => router.push({name: "Login"});
  GoogleLogin.signOut(signOutCallback, signOutCallback);
}

export default {

  setPushNotificationEnabled: (newVal: boolean) =>
    (pushNotificationEnabled = newVal),

  getBackendUrl: () => BACKEND_URL,

  handleError(errorResponse: any) {
    console.log(errorResponse);

    if (errorResponse.status === 401) {
      const fullRoutePath = router.currentRoute.fullPath;

      store.commit("logoutUser");

      pushNotificationEnabled = false;

      const signOutCallback = () =>
        router.push({name: "Login", query: {returnPath: fullRoutePath}});
      GoogleLogin.signOut(signOutCallback, signOutCallback);
    } else {
      errorResponse.json().then(body => store.commit("addError", body))
    }
  },

  logout() {
    doLogout();
  }
};


