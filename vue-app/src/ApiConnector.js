import Vue from 'vue'
import store from './store'
import router from './router'
import EventBus from './EventBus'
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
          var authUrl = backendUrl + '/auth/authorizationCode?authCode=' + encodeURIComponent(authCode);

          return Vue.http.get(authUrl).then(response => {
            store.commit('loginUser', {username: response.body.username, token: response.body.token})
    
            if (returnPath.length > 0) {
              console.log("Moving to custom path")
              router.push({path: returnPath})
            } else {
              console.log("Moving to default path")
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
      var fullRoutePath = router.currentRoute.fullPath
      console.log("Current path", fullRoutePath)

      store.commit("logoutUser")

      pushNotificationEnabled = false;

      console.log("401 Unauthorized")
      var signOutCallback = () => router.push({name: 'Login', query: { returnPath: fullRoutePath } })
      GoogleLogin.signOut(signOutCallback, signOutCallback)
    }
  },

  logout: function() {
    doLogout()
  }
}

function headersWithToken(token) {
  return { 'headers': {'Authorization': 'Bearer ' + token } }
}

function doLogout() {
  store.commit("logoutUser")

  pushNotificationEnabled = false;

  var signOutCallback = () => router.push({name: 'Login'})
  GoogleLogin.signOut(signOutCallback, signOutCallback)
}