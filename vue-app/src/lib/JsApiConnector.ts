import Vue from "vue";
import store from "../store";
import router from "../router";
import GoogleLogin from "./GoogleLogin";
import {BACKEND_URL, VAPID_PUBLIC_KEY} from "@/lib/config";

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
  getPushNotificationEnabled: () => pushNotificationEnabled,

  setPushNotificationEnabled: (newVal: boolean) =>
    (pushNotificationEnabled = newVal),

  getBackendUrl: () => BACKEND_URL,

  loginWithGoogle: (returnPath = "") => {
    return new Promise((resolve, reject) => {
      GoogleLogin.signIn()
        .then(authCode => {
          const authUrl =
            BACKEND_URL +
            "/auth/authorizationCode?authCode=" +
            encodeURIComponent(authCode);

          return Vue.http.get(authUrl).then((response: any) => {
            store.commit("loginUser", {
              username: response.body.username,
              token: response.body.token
            });

            if (returnPath.length > 0) {
              router.push({ path: returnPath });
            } else {
              router.push({ name: "TodayOrders" });
            }

            resolve();
          });
        })
        .catch((error: any) => {
          if (error.status === 0) {
            reject("Connection error!!");
          } else if (typeof error.error !== "undefined") {
            reject(error.error);
          } else {
            reject(error);
          }
        });
    });
  },

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

  initializePushNotifications() {
    if (this.getPushNotificationEnabled() === false) {
      if ("serviceWorker" in navigator) {
        this.initialiseState();
      } else {
        console.warn("Service workers are not supported in this browser.");
      }

      this.setPushNotificationEnabled(true);
    }
  },

  initialiseState() {
    if (!("showNotification" in ServiceWorkerRegistration.prototype)) {
      console.warn("Notifications aren't supported.");
      return;
    }

    if (Notification.permission === "denied") {
      console.warn("The user has blocked notifications.");
      return;
    }

    // Check is push API is supported
    if (!("PushManager" in window)) {
      console.warn("Push messaging isn't supported.");
      return;
    }

    return navigator.serviceWorker.ready.then(serviceWorkerRegistration => {
      serviceWorkerRegistration.pushManager
        .getSubscription()
        .then(subscription => {
          if (!subscription) {
            this.subscribe();
          } else {
            this.sendSubscriptionToServer(subscription);
          }
        })
        .catch(err => console.warn("Error during getSubscription()", err));
    });
  },

  subscribe() {
    return navigator.serviceWorker.ready.then(serviceWorkerRegistration => {
      const subscribePayload = {
        userVisibleOnly: true,
        applicationServerKey: VAPID_PUBLIC_KEY
      };

      console.log("Subscribe payload: ", subscribePayload);

      serviceWorkerRegistration.pushManager
        .subscribe(subscribePayload)
        .then(subscription => {
          console.log("Subscription: ", subscription);
          this.sendSubscriptionToServer(subscription);
        })
        .catch(e => {
          if (Notification.permission === "denied") {
            console.warn("Permission for Notifications was denied");
          } else {
            console.error("Unable to subscribe to push.", e);
          }
        });
    });
  },

  sendSubscriptionToServer(subscription: any) {
    const key = subscription.getKey ? subscription.getKey("p256dh") : "";
    const auth = subscription.getKey ? subscription.getKey("auth") : "";

    console.log("key: ", key);
    console.log("auth: ", auth);

    const subscribeData = JSON.stringify({
      endpoint: subscription.endpoint,
      p256dhKey: key
        ? btoa(String.fromCharCode(...new Uint8Array(key)))
        : "",
      authKey: auth
        ? btoa(String.fromCharCode(...new Uint8Array(auth)))
        : ""
    });

    const url = "/notification/subscribe";

    console.log("url: ", url);

    return Vue.http.post(
      BACKEND_URL + url,
      subscribeData,
      headersWithToken(store.state.token)
    );
  },

  logout() {
    doLogout();
  }
};
