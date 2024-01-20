import {Component, OnInit} from '@angular/core';
import {FrontendConfigService} from "../../../service/frontend-config.service";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../../../service/auth.service";
import {TestAuthControllerService, TestUserLoginPayload, User} from "../../../../frontend-client";
import {Router} from "@angular/router";
import {ButtonComponent} from '../../../components/button/button.component';
import {NgFor} from '@angular/common';
import {MatToolbarModule} from '@angular/material/toolbar';

@Component({
    selector: 'app-test-login-view',
    templateUrl: './test-login-view.component.html',
    styleUrls: ['./test-login-view.component.scss'],
    standalone: true,
    imports: [MatToolbarModule, NgFor, ButtonComponent]
})
export class TestLoginViewComponent implements OnInit {

  constructor(private frontendConfigService: FrontendConfigService,
              private testAuthControllerService: TestAuthControllerService,
              private httpClient: HttpClient,
              private authService: AuthService,
              private router: Router) {
  }

  usersList: User[] = [];

  ngOnInit() {
    this.getTestUsers()
  }

  loginAsUser(user: User) {
    const payload = {
      username: user.username,
      email: user.email
    }
    this.doLogin(payload);
  }

  private getTestUsers() {
    this.testAuthControllerService.getTestUsersList()
      .subscribe({
        next: (data: User[]) => {
          this.usersList = data.sort((a, b) => a.username.localeCompare(b.username))
        },
        error: err => {
          console.error('Error:', err);
        }
      });
  }

  private doLogin(testUser: TestUserLoginPayload) {
    this.testAuthControllerService.testLogin(testUser).subscribe({
      next: data => {
        this.authService.loginAsTestUser(data)
      },
      error: err => {
        console.error('Error:', err);
      }
    })
    //
    // this.frontendConfigService.getConfig()
    //   .pipe(
    //     switchMap(config => {
    //       const url = `${config.currentDomain}/api/auth/testUser/login`
    //       return this.httpClient.post<AuthUserInfo>(url, payload)
    //     })
    //   ).subscribe(
    //   {
    //     next: data => {
    //       this.authService.loginAsTestUser(data)
    //     },
    //     error: err => {
    //       console.error('Error:', err);
    //     }
    //   }
    // )
  }
}
