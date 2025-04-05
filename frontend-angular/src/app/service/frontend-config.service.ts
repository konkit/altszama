import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, tap} from "rxjs";
import {HttpClient} from "@angular/common/http";

import * as Sentry from "@sentry/angular";

export interface FrontendConfig {
  currentDomain: string;
  vapidPublicKey: string;
  googleClientId: string;
  sentryUrl: string;
}

let emptyObj = {
  currentDomain: "",
  googleClientId: "",
  vapidPublicKey: "",
  sentryUrl: ""
};

@Injectable({
  providedIn: 'root'
})
export class FrontendConfigService {

  config: BehaviorSubject<FrontendConfig> = new BehaviorSubject<FrontendConfig>(emptyObj)

  constructor(private http: HttpClient) {
  }

  initConfig(): Observable<FrontendConfig> {
    const CURRENT_DOMAIN = location.protocol + "//" + location.hostname + (location.port ? ":" + location.port : "");
    const CONFIG_URL = CURRENT_DOMAIN + "/api/frontendConfig";

    return this.http.get<FrontendConfig>(CONFIG_URL).pipe(
      tap(response => {
        let newConfig = {
          currentDomain: CURRENT_DOMAIN,
          googleClientId: response.googleClientId,
          vapidPublicKey: response.vapidPublicKey,
          sentryUrl: response.sentryUrl,
        };

        if (response.sentryUrl) {
          this.initSentry(response.sentryUrl)
        }

        this.config.next(newConfig);
      })
    )
  }

  getConfig(): Observable<FrontendConfig> {
    return this.config.asObservable();
  }

  initSentry(sentryUrl: string) {
      Sentry.init({
        dsn: sentryUrl,
        integrations: [Sentry.browserTracingIntegration(),],
        tracesSampleRate: 1.0,
        tunnel: "/api/sentry",
      });
  }
}
