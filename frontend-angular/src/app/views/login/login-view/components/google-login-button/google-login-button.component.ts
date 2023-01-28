import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {GoogleLoginService} from "../../../../../service/google-login.service";
import {AuthControllerService, GooglePayload} from "../../../../../../frontend-client";
import {FrontendConfigService} from "../../../../../service/frontend-config.service";
import {catchError, from, map, switchMap} from "rxjs";

@Component({
  selector: 'app-google-login-button',
  templateUrl: './google-login-button.component.html',
  styleUrls: ['./google-login-button.component.scss']
})
export class GoogleLoginButtonComponent implements OnInit {

  loginLoaded = false
  loginPending = false

  @ViewChild('googleSignInButtonDiv')
  googleSignInButtonDiv!: ElementRef<HTMLInputElement>;

  constructor(
    private authControllerService: AuthControllerService,
    private googleLoginService: GoogleLoginService,
    private frontendConfigService: FrontendConfigService
  ) {}

  ngOnInit() {
    this.frontendConfigService.getConfig().pipe(
      switchMap(_ => this.googleLoginService.load())
    ).subscribe(googleClientId => {
      this.loginLoaded = true;

      this.googleLoginService.initializeGoogleLogin(googleClientId, (payload) => this.doSignin(payload));
      this.googleLoginService.renderGoogleLoginButton(this.googleSignInButtonDiv);
    })
  }

  doSignin(payload: GooglePayload) {
    this.loginPending = true;

    let returnPath = "";
    //TODO: fix returnpath
    // if (this.$route.query.returnPath) {
    //   returnPath = this.$route.query.returnPath as string;
    // }

    this.authControllerService.loginWithReceivedJwt(payload)
      .subscribe({
        error: e => {
          // if (e) {
          //   this.$store.commit("replaceError", e);
          // }

          this.loginPending = false;
        }
      });
  }

}
