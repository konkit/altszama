import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

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

  constructor(private http: HttpClient) { }

  initConfig() {
    const CURRENT_DOMAIN = location.protocol + "//" + location.hostname + (location.port ? ":" + location.port : "");
    const CONFIG_URL = CURRENT_DOMAIN + "/api/frontendConfig";

    this.http.get<FrontendConfig>(CONFIG_URL).subscribe(response => {
      let newConfig = {
        currentDomain: CURRENT_DOMAIN,
        googleClientId: response.googleClientId,
        vapidPublicKey: response.vapidPublicKey,
        sentryUrl: response.sentryUrl,
      };

      this.config.next(newConfig);
    })
  }

  getConfig(): Observable<FrontendConfig> {
    return this.config.asObservable();
  }
}
