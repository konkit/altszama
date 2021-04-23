import store from "@/store";
import {NotificationControllerApi, PushNotifSubscriptionData} from "@/frontend-client";
import {AbstractApiConnector} from "@/lib/api/AbstractApiConnector";
import {getConfig} from "@/lib/config";


export default class NotificationsApiConnector extends AbstractApiConnector {

  private readonly notificationControllerApi: NotificationControllerApi

  constructor() {
    super()
    this.notificationControllerApi = new NotificationControllerApi(this.createConfiguration());
  }

  initializePushNotifications() {
    if (store.state.pushNotificationEnabled === false) {
      if ("serviceWorker" in navigator) {
        this.initialiseState();
      } else {
        console.warn("Service workers are not supported in this browser.");
      }

      store.commit("setPushNotificationEnabled", true)
    }
  }

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
  }

  subscribe() {
    return navigator.serviceWorker.ready.then(serviceWorkerRegistration => {
      const subscribePayload = {
        userVisibleOnly: true,
        applicationServerKey: getConfig().vapidPublicKey
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
  }

  sendSubscriptionToServer(subscription: PushSubscription) {
    const key = subscription.getKey ? subscription.getKey("p256dh") : "";
    const auth = subscription.getKey ? subscription.getKey("auth") : "";

    const subscribeData: PushNotifSubscriptionData = {
      endpoint: subscription.endpoint,
      p256dhKey: key ? btoa(String.fromCharCode(...new Uint8Array(key))) : "",
      authKey: auth ? btoa(String.fromCharCode(...new Uint8Array(auth))) : ""
    };

    return this.notificationControllerApi.addSubscriber(subscribeData, this.headersWithToken())
  }
}
