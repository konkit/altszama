import Vue from 'vue';
import store from '../store';
import router from '../router';
import GoogleLogin from './GoogleLogin';
var currentDomain = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
var backendUrl = process.env.VUE_APP_BACKEND_URL || currentDomain;
var vapidPublicKey = process.env.VUE_APP_VAPID_PUBLIC_KEY;
var pushNotificationEnabled = false;
export default {
    getPushNotificationEnabled: function () { return pushNotificationEnabled; },
    setPushNotificationEnabled: function (newVal) { return pushNotificationEnabled = newVal; },
    getBackendUrl: function () { return backendUrl; },
    loginWithGoogle: function (returnPath) {
        if (returnPath === void 0) { returnPath = ""; }
        return new Promise(function (resolve, reject) {
            GoogleLogin.signIn()
                .then(function (authCode) {
                var authUrl = backendUrl + '/auth/authorizationCode?authCode=' + encodeURIComponent(authCode);
                return Vue.http.get(authUrl).then(function (response) {
                    store.commit('loginUser', { username: response.body.username, token: response.body.token });
                    if (returnPath.length > 0) {
                        router.push({ path: returnPath });
                    }
                    else {
                        router.push({ name: 'TodayOrders' });
                    }
                    resolve();
                });
            })
                .catch(function (error) {
                if (error.status === 0) {
                    reject("Connection error!!");
                }
                else if (typeof error.error !== "undefined") {
                    reject(error.error);
                }
                else {
                    reject(error);
                }
            });
        });
    },
    makeGet: function (relPath) {
        this.token = store.state.token;
        return Vue.http.get(backendUrl + relPath, headersWithToken(this.token));
    },
    makePost: function (relPath, formData) {
        this.token = store.state.token;
        return Vue.http.post(backendUrl + relPath, formData, headersWithToken(this.token));
    },
    makeDelete: function (relPath) {
        this.token = store.state.token;
        return Vue.http.delete(backendUrl + relPath, headersWithToken(this.token));
    },
    handleError: function (errorResponse) {
        if (errorResponse.status === 401) {
            var fullRoutePath_1 = router.currentRoute.fullPath;
            store.commit("logoutUser");
            pushNotificationEnabled = false;
            var signOutCallback = function () { return router.push({ name: 'Login', query: { returnPath: fullRoutePath_1 } }); };
            GoogleLogin.signOut(signOutCallback, signOutCallback);
        }
        else {
            store.commit("addError", errorResponse);
        }
    },
    initializePushNotifications: function () {
        if (this.getPushNotificationEnabled() === false) {
            if ('serviceWorker' in navigator) {
                this.initialiseState();
            }
            else {
                console.warn('Service workers are not supported in this browser.');
            }
            this.setPushNotificationEnabled(true);
        }
    },
    initialiseState: function () {
        var _this = this;
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
            .then(function (serviceWorkerRegistration) {
            serviceWorkerRegistration.pushManager.getSubscription()
                .then(function (subscription) {
                if (!subscription) {
                    _this.subscribe();
                }
                else {
                    _this.sendSubscriptionToServer(subscription);
                }
            })
                .catch(function (err) { return console.warn('Error during getSubscription()', err); });
        });
    },
    subscribe: function () {
        var _this = this;
        return navigator.serviceWorker.ready
            .then(function (serviceWorkerRegistration) {
            var subscribePayload = {
                userVisibleOnly: true,
                applicationServerKey: vapidPublicKey
            };
            console.log("Subscribe payload: ", subscribePayload);
            serviceWorkerRegistration.pushManager.subscribe(subscribePayload)
                .then(function (subscription) {
                console.log("Subscription: ", subscription);
                _this.sendSubscriptionToServer(subscription);
            })
                .catch(function (e) {
                if (Notification.permission === 'denied') {
                    console.warn('Permission for Notifications was denied');
                }
                else {
                    console.error('Unable to subscribe to push.', e);
                }
            });
        });
    },
    sendSubscriptionToServer: function (subscription) {
        var key = subscription.getKey ? subscription.getKey('p256dh') : '';
        var auth = subscription.getKey ? subscription.getKey('auth') : '';
        console.log("key: ", key);
        console.log("auth: ", auth);
        var subscribeData = JSON.stringify({
            endpoint: subscription.endpoint,
            p256dhKey: key ? btoa(String.fromCharCode.apply(null, new Uint8Array(key))) : '',
            authKey: auth ? btoa(String.fromCharCode.apply(null, new Uint8Array(auth))) : ''
        });
        var url = '/notification/subscribe';
        console.log("url: ", url);
        return this.makePost(url, subscribeData);
    },
    logout: function () {
        doLogout();
    }
};
function headersWithToken(token) {
    return { 'headers': { 'Authorization': 'Bearer ' + token } };
}
function doLogout() {
    store.commit("logoutUser");
    pushNotificationEnabled = false;
    var signOutCallback = function () { return router.push({ name: 'Login' }); };
    GoogleLogin.signOut(signOutCallback, signOutCallback);
}
//# sourceMappingURL=ApiConnector.js.map