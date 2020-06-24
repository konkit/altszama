import Vue from 'vue'
import store from '../store'
import router from '../router'
import GoogleLogin from './GoogleLogin'

const currentDomain = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
const backendUrl = process.env.VUE_APP_BACKEND_URL || currentDomain;
const vapidPublicKey = process.env.VUE_APP_VAPID_PUBLIC_KEY;

let pushNotificationEnabled = false;

export default {
  getPushNotificationEnabled: () => pushNotificationEnabled,

  setPushNotificationEnabled: (newVal) => pushNotificationEnabled = newVal,
  
  getBackendUrl: () => backendUrl,
  
  loginWithGoogle: (returnPath = "") => {
    return new Promise((resolve, reject) => {
      GoogleLogin.signIn()
        .then((authCode) => {
          const authUrl = backendUrl + '/auth/authorizationCode?authCode=' + encodeURIComponent(authCode);

          return Vue.http.get(authUrl).then(response => {
            store.commit('loginUser', {username: response.body.username, token: response.body.token});
    
            if (returnPath.length > 0) {
              router.push({path: returnPath})
            } else {
              router.push({name: 'TodayOrders'})
            }

            resolve()
          })
        })
        .catch((error) => {
          if( error.status === 0) {
            reject("Connection error!!")
          } else if( typeof error.error !== "undefined" ) {
            reject(error.error)
          } else {
            reject(error)
          }
        })
    })
  },

  makeGet (relPath) {
    this.token = store.state.token;
    return Vue.http.get(backendUrl + relPath, headersWithToken(this.token))
  },

  makePost (relPath, formData) {
    this.token = store.state.token;
    return Vue.http.post(backendUrl + relPath, formData, headersWithToken(this.token))
  },

  handleError (errorResponse) {
    if (errorResponse.status === 401) {
      const fullRoutePath = router.currentRoute.fullPath;

      store.commit("logoutUser");

      pushNotificationEnabled = false;

      const signOutCallback = () => router.push({name: 'Login', query: { returnPath: fullRoutePath }});
      GoogleLogin.signOut(signOutCallback, signOutCallback)
    } else {
      store.commit("addError", errorResponse)
    }
  },

  initializePushNotifications () {
    if (this.getPushNotificationEnabled() === false) {
      if ('serviceWorker' in navigator) {
        this.initialiseState();
      } else {
        console.warn('Service workers are not supported in this browser.');
      }

      this.setPushNotificationEnabled(true)
    }
  },

  initialiseState () {
    if (!('showNotification' in ServiceWorkerRegistration.prototype)) {
      console.warn('Notifications aren\'t supported.');
      return;
    }

    if (Notification.permission === 'denied') {
      console.warn('The user has blocked notifications.');
      return;
    }

    // Check is push API is supported
    if (!('PushManager' in window)) {
      console.warn('Push messaging isn\'t supported.');
      return;
    }

    return navigator.serviceWorker.ready
      .then(serviceWorkerRegistration => {
        serviceWorkerRegistration.pushManager.getSubscription()
          .then((subscription) => {
            if (!subscription) {
              this.subscribe();
            } else {
              this.sendSubscriptionToServer(subscription);
            }
          })
          .catch(err => console.warn('Error during getSubscription()', err));
      });
  },

  subscribe () {
    return navigator.serviceWorker.ready
      .then(serviceWorkerRegistration => {
        let subscribePayload = {
          userVisibleOnly: true,
          applicationServerKey: vapidPublicKey
        };

        console.log("Subscribe payload: ", subscribePayload);

        serviceWorkerRegistration.pushManager.subscribe(subscribePayload)
          .then(subscription => {
            console.log("Subscription: ", subscription)
            this.sendSubscriptionToServer(subscription)
          })
          .catch(e => {
            if (Notification.permission === 'denied') {
              console.warn('Permission for Notifications was denied');
            } else {
              console.error('Unable to subscribe to push.', e);
            }
          });
      });
  },

  sendSubscriptionToServer(subscription) {
    const key = subscription.getKey ? subscription.getKey('p256dh') : '';
    const auth = subscription.getKey ? subscription.getKey('auth') : '';

    console.log("key: ", key);
    console.log("auth: ", auth);

    const subscribeData = JSON.stringify({
      endpoint: subscription.endpoint,
      p256dhKey: key ? btoa(String.fromCharCode.apply(null, new Uint8Array(key))) : '',
      authKey: auth ? btoa(String.fromCharCode.apply(null, new Uint8Array(auth))) : ''
    });

    const url = '/notification/subscribe';

    console.log("url: ", url);

    return this.makePost(url, subscribeData);
  },

  logout () {
    doLogout()
  }
}

function headersWithToken(token) {
  return { 'headers': {'Authorization': 'Bearer ' + token } }
}

function doLogout() {
  store.commit("logoutUser");

  pushNotificationEnabled = false;

  const signOutCallback = () => router.push({name: 'Login'});
  GoogleLogin.signOut(signOutCallback, signOutCallback)
}