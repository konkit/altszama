import Vue from 'vue'
import store from '../store'
import router from '../router'
import GoogleLogin from './GoogleLogin.js'

var currentDomain = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');
var backendUrl = process.env.VUE_APP_BACKEND_URL || currentDomain;

var pushNotificationEnabled = false;

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

  makeGet: function(relPath) {
    this.token = store.state.token;
    return Vue.http.get(backendUrl + relPath, headersWithToken(this.token))
  },

  makePost: function(relPath, formData) {
    this.token = store.state.token;
    return Vue.http.post(backendUrl + relPath, formData, headersWithToken(this.token))
  },

  handleError: function(errorResponse) {
    console.log("errorResponse: ", errorResponse);

    if (errorResponse.status === 401) {
      var fullRoutePath = router.currentRoute.fullPath;
      console.log("Current path", fullRoutePath);

      store.commit("logoutUser");

      pushNotificationEnabled = false;

      console.log("401 Unauthorized");
      var signOutCallback = () => router.push({name: 'Login', query: { returnPath: fullRoutePath } });
      GoogleLogin.signOut(signOutCallback, signOutCallback)
    }
  },

  initializePushNotifications: function() {
    if (this.getPushNotificationEnabled() === false) {
      if ('serviceWorker' in navigator) {
        console.log("Initialise state");
        this.initialiseState();
      } else {
        console.warn('Service workers are not supported in this browser.');
      }

      this.setPushNotificationEnabled(true)
    }
  },

  initialiseState: function() {
    console.log("Initialise state");

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

    navigator.serviceWorker.ready.then(function (serviceWorkerRegistration) {
      // Get the push notification subscription object
      serviceWorkerRegistration.pushManager.getSubscription().then(function (subscription) {

        // If this is the user's first visit we need to set up
        // a subscription to push notifications
        if (!subscription) {
          this.subscribe();

          return;
        }

        // Update the server state with the new subscription
        this.sendSubscriptionToServer(subscription);
      })
        .catch(function (err) {
          // Handle the error - show a notification in the GUI
          console.warn('Error during getSubscription()', err);
        });
    });
  },

  subscribe: function () {
    navigator.serviceWorker.ready.then(function (serviceWorkerRegistration) {

      serviceWorkerRegistration.pushManager.subscribe({userVisibleOnly: true}).then(function (subscription) {

        // Update the server state with the new subscription
        return this.sendSubscriptionToServer(subscription);
      })
        .catch(function (e) {
          if (Notification.permission === 'denied') {
            console.warn('Permission for Notifications was denied');
          } else {
            console.error('Unable to subscribe to push.', e);
          }
        });
    });
  },

  sendSubscriptionToServer: function(subscription) {
    const key = subscription.getKey ? subscription.getKey('p256dh') : '';
    const auth = subscription.getKey ? subscription.getKey('auth') : '';

    const subscribeData = JSON.stringify({
      endpoint: subscription.endpoint,
      p256dhKey: key ? btoa(String.fromCharCode.apply(null, new Uint8Array(key))) : '',
      authKey: auth ? btoa(String.fromCharCode.apply(null, new Uint8Array(auth))) : ''
    });

    const url = this.getBackendUrl() + '/notification/subscribe';
    const authToken = localStorage.getItem("token");

    this.makePost(url, subscribeData);
  },

  logout: function() {
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