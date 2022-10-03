import {getConfig} from "@/lib/config";
import {GooglePayload} from "@/frontend-client";

const gsiClientSrc = "https://accounts.google.com/gsi/client";

function installClient() {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script") as any;
    script.src = gsiClientSrc;
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

export default {
  load(): Promise<string> {
    return new Promise((resolve, reject) => {
      installClient()
        .then(() => {
          const googleClientId = getConfig().googleClientId
          resolve(googleClientId);
        });
    });
  },

  initializeGoogleLogin(googleClientId: string, callback: (payload: GooglePayload) => unknown) {
    (window as any).google.accounts.id.initialize({
      // eslint-disable-next-line @typescript-eslint/camelcase
      client_id: googleClientId,
      callback: (payload: GooglePayload) => callback(payload)
    });
  },

  renderGoogleLoginButton(googleButtonWrapperDiv: Vue | Vue[] | Element | Element[]) {
    (window as any).google.accounts.id.renderButton(
      googleButtonWrapperDiv,
      {theme: "outline", size: "large"}
    );
  },
};
