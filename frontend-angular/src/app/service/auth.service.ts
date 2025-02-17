import {inject, Injectable} from '@angular/core';
import {AuthControllerService, AuthUserInfo, GooglePayload} from "../../frontend-client";
import {FrontendConfigService} from "./frontend-config.service";
import {tap} from "rxjs";
import {Router} from "@angular/router";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private defaultLoginPath = "/orders/today";
  private defaultLogoutPath = "/login";

  private authControllerService = inject(AuthControllerService);

  constructor(private frontendConfigService: FrontendConfigService,
              private router: Router) {
  }

  loginWithGoogle(googlePayload: GooglePayload, returnPath = "") {
    return this.authControllerService.loginWithReceivedJwt(googlePayload)
      .pipe(
        tap(response => {
          localStorage.setItem("loggedUserData", JSON.stringify(response.userInfo));

          if (returnPath.length > 0) {
            this.router.navigate([returnPath])
          } else {

            this.router.navigate([this.defaultLoginPath])
          }
        }),
      )
  }

  loginAsTestUser(data: AuthUserInfo) {
    localStorage.setItem("loggedUserData", JSON.stringify(data));
    this.router.navigate([this.defaultLoginPath]);
  }

  getLoggedUser(): AuthUserInfo | null {
    const entry = localStorage.getItem("loggedUserData");
    if (entry != null) {
      return JSON.parse(entry);
    } else {
      return null;
    }
  }

  logoutAndNavigateToLoginPage() {
    localStorage.removeItem("loggedUserData");
    this.router.navigate([this.defaultLogoutPath]);
  }

  getToken() {

  }
}
