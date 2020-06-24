const gapiUrl = 'https://apis.google.com/js/api:client.js';

export default {
  load () {
    return new Promise((resolve, reject) => {
      if (window.gapi === undefined) {
        installClient()
            .then(() => initClient())
            .then(() => { resolve() })
      } else if (window.gapi !== undefined && window.gapi.auth2 === undefined) {
        initClient()
          .then(() => { resolve() })
      } else {
        resolve()
      }}
    )
  },

  signIn () {
    return new Promise((resolve, reject) => {
      window.gapi.auth2.getAuthInstance().grantOfflineAccess( { redirect_uri: 'postmessage' } )
        .then((response) => resolve(response.code))
        .catch((error) => reject(error))
    })
  },

  signOut (successCallback, errorCallback) {
    if (window.gapi && window.gapi.auth2) {
      window.gapi.auth2.getAuthInstance().signOut()
        .then(() => successCallback(), () => errorCallback(error)) 
    } else {
      // no window.gapi object, just assume we are logged out
      successCallback()
    }
  }
}

function installClient () {
  return new Promise((resolve, reject) => {
    var script = document.createElement('script')
    script.src = gapiUrl
    script.onreadystatechange = script.onload = () => {
      if (!script.readyState || /loaded|complete/.test(script.readyState)) {
        setTimeout(() => { resolve() }, 500)
      }
    }
    document.getElementsByTagName('head')[0].appendChild(script)
  })
}

function initClient () {
  const googleConfig = {
    client_id: process.env.VUE_APP_GOOGLE_CLIENT_ID
  };

  return new Promise((resolve, reject) => {
    window.gapi.load('auth2', () => {
      window.gapi.auth2.init(googleConfig)
      resolve()
    })
  })
}