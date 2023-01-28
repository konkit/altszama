import { Injectable } from '@angular/core';
import {AuthControllerService, AuthUserInfo, GooglePayload} from "../../frontend-client";
import {GoogleLoginService} from "./google-login.service";
import {FrontendConfigService} from "./frontend-config.service";
import {BehaviorSubject, Observable, ReplaySubject, take} from "rxjs";
import {Router} from "@angular/router";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(    private authControllerService: AuthControllerService,
                  private googleLoginService: GoogleLoginService,
                  private frontendConfigService: FrontendConfigService,
                  private router: Router) {
    // const dataFromLocalStorage: string | null = localStorage.getItem("loggedUserData");
    // if (dataFromLocalStorage != null) {
    //   this.loggedUser.next(JSON.parse(dataFromLocalStorage))
    // }
  }

  loginWithGoogle(googlePayload: GooglePayload, returnPath = "") {
    return this.authControllerService.loginWithReceivedJwt(googlePayload).subscribe(response => {
      localStorage.setItem("loggedUserData", JSON.stringify(response.userInfo));

      //TODO
      // if (returnPath.length > 0) {
      //   router.push({path: returnPath});
      // } else {
      //   router.push({name: "TodayOrders"});
      // }

      this.router.navigate(["/orders"])
    })
  }

  loginAsTestUser(data: AuthUserInfo) {
    localStorage.setItem("loggedUserData", JSON.stringify(data));
    this.router.navigate(["/orders"]);
  }

  getLoggedUser(): AuthUserInfo | null {
    const entry = localStorage.getItem("loggedUserData");
    if (entry != null) {
      return JSON.parse(entry);
    } else {
      return null;
    }
  }

  logout() {
    localStorage.removeItem("loggedUserData");
  }
}
