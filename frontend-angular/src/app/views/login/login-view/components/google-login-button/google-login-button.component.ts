import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AuthControllerService, GooglePayload} from "../../../../../../frontend-client";
import {FrontendConfigService} from "../../../../../service/frontend-config.service";
import {from, map, Observable, switchMap} from "rxjs";
import {AuthService} from "../../../../../service/auth.service";

const gsiClientSrc = "https://accounts.google.com/gsi/client";

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
    private authService: AuthService,
    private authControllerService: AuthControllerService,
    private frontendConfigService: FrontendConfigService
  ) {}

  ngOnInit() {
    this.loadGoogleClientAndGetClientId().subscribe(googleClientId => {
      this.loginLoaded = true;

      this.initializeGoogleLogin(googleClientId, (payload) => this.doSignin(payload));
      this.renderGoogleLoginButton(this.googleSignInButtonDiv);
    })
  }

  doSignin(payload: GooglePayload) {
    this.loginPending = true;

    let returnPath = "";
    //TODO: fix returnpath
    // if (this.$route.query.returnPath) {
    //   returnPath = this.$route.query.returnPath as string;
    // }

    this.authService.loginWithGoogle(payload, returnPath)
      .subscribe({
        error: e => {
          // if (e) {
          //   this.$store.commit("replaceError", e);
          // }

          this.loginPending = false;
        }
      });
  }


  private loadGoogleClientAndGetClientId(): Observable<string> {
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

  renderGoogleLoginButton(googleButtonWrapperDiv: ElementRef<HTMLElement>) {
    (window as any).google.accounts.id.renderButton(
      googleButtonWrapperDiv.nativeElement,
      {theme: "outline", size: "large"}
    );
  }


}