import {ElementRef, Injectable} from '@angular/core';
import {GooglePayload} from "../../frontend-client";
import {from, map, Observable, switchMap} from "rxjs";
import {FrontendConfigService} from "./frontend-config.service";

const gsiClientSrc = "https://accounts.google.com/gsi/client";


@Injectable({
  providedIn: 'root'
})
export class GoogleLoginService {

  constructor(private frontendConfigService: FrontendConfigService) {
  }

  load(): Observable<string> {
    return from(this.installClient())
      .pipe(
        switchMap(_ => this.frontendConfigService.getConfig()),
        map(x => x.googleClientId)
      );
  }

  private installClient() {
    return new Promise<void>((resolve, reject) => {
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

  initializeGoogleLogin(googleClientId: string, callback: (payload: GooglePayload) => unknown) {
    (window as any).google.accounts.id.initialize({
      // eslint-disable-next-line @typescript-eslint/camelcase
      client_id: googleClientId,
      callback: (payload: GooglePayload) => callback(payload)
    });
  }

  renderGoogleLoginButton(googleButtonWrapperDiv: ElementRef) {
    (window as any).google.accounts.id.renderButton(
      googleButtonWrapperDiv,
      {theme: "outline", size: "large"}
    );
  }

}
