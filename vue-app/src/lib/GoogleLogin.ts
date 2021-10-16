import {getConfig} from "@/lib/config";

const gapiUrl = "https://apis.google.com/js/api:client.js";

const gapi = () => (window as any).gapi as any;

function installClient() {
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement("script") as any;
    script.src = gapiUrl;
    script.onreadystatechange = script.onload = () => {
      const readyState: any = (script as any).readyState;
      if (!readyState || /loaded|complete/.test(readyState)) {
        setTimeout(() => {
          resolve();
        }, 500);
      }
    };
    document.getElementsByTagName("head")[0].appendChild(script);
  });
}

function initClient() {
  const googleConfig = {
    "client_id": getConfig().googleClientId
  };

  return new Promise<void>((resolve, reject) => {
    gapi().load("auth2", () => {
      gapi().auth2.init(googleConfig);
      resolve();
    });
  });
}

export default {
  load() {
    return new Promise<void>((resolve, reject) => {
      if (gapi() === undefined) {
        installClient()
          .then(() => initClient())
          .then(() => {
            resolve();
          });
      } else if (gapi() !== undefined && gapi().auth2 === undefined) {
        initClient().then(() => {
          resolve();
        });
      } else {
        resolve();
      }
    });
  },

  signIn(): Promise<string> {
    return new Promise((resolve, reject) => {
      gapi().auth2
        .getAuthInstance()
        .grantOfflineAccess({ "redirect_uri": "postmessage" })
        .then((response: any) => resolve(response.code as string))
        .catch((error: any) => reject(error));
    });
  },

  signOut(successCallback: any, errorCallback: any) {
    if (gapi() && gapi().auth2) {
      const signOutResult: Promise<any> = gapi().auth2
        .getAuthInstance()
        .signOut()

      signOutResult
        .then(
          () => successCallback(),
          error => errorCallback(error)
        );
    } else {
      // no gapi object, just assume we are logged out
      successCallback();
    }
  }
};
