import Vue from "vue";
import store from "../store";
import router from "../router";
import GoogleLogin from "./GoogleLogin";

const currentDomain =
  location.protocol +
  "//" +
  location.hostname +
  (location.port ? ":" + location.port : "");
const backendUrl = process.env.VUE_APP_BACKEND_URL || currentDomain;
const vapidPublicKey = process.env.VUE_APP_VAPID_PUBLIC_KEY;

let pushNotificationEnabled = false;

function headersWithToken(token: string) {
  return { headers: { Authorization: "Bearer " + token } };
}

function doLogout() {
  store.commit("logoutUser");

  pushNotificationEnabled = false;

  const signOutCallback = () => router.push({ name: "Login" });
  GoogleLogin.signOut(signOutCallback, signOutCallback);
}

export default {

  setPushNotificationEnabled: (newVal: boolean) =>
    (pushNotificationEnabled = newVal),

  getBackendUrl: () => backendUrl,

  handleError(errorResponse: any) {
    console.log(errorResponse);

    if (errorResponse.status === 401) {
      const fullRoutePath = router.currentRoute.fullPath;

      store.commit("logoutUser");

      pushNotificationEnabled = false;

      const signOutCallback = () =>
        router.push({ name: "Login", query: { returnPath: fullRoutePath } });
      GoogleLogin.signOut(signOutCallback, signOutCallback);
    } else {
      store.commit("addError", errorResponse);
    }
  },

  logout() {
    doLogout();
  }
};


