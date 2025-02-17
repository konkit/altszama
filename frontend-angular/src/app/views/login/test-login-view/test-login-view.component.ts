import {Component, computed, OnInit, signal} from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {FrontendConfigService} from '../../../service/frontend-config.service';
import {TestAuthControllerService, TestUserLoginPayload, User} from '../../../../frontend-client';
import {AuthService} from '../../../service/auth.service';
import {Router} from '@angular/router';
import {ButtonComponent} from '../../../components/button/button.component';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';

@Component({
  selector: 'app-test-login-view',
  templateUrl: './test-login-view.component.html',
  styleUrl: './test-login-view.component.scss',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, ButtonComponent, FormsModule, MatInputModule]
})
export class TestLoginViewComponent implements OnInit {

  constructor(private frontendConfigService: FrontendConfigService,
              private testAuthControllerService: TestAuthControllerService,
              private authService: AuthService,
              private router: Router) {
  }

  usersList = signal<User[]>([]);
  filterPhrase = signal<string>("");
  filteredUsers = computed(() => {
    return this.usersList().filter(u => u.username.toLowerCase().startsWith(this.filterPhrase().toLowerCase()))
  })

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
          this.usersList.set(data.sort((a, b) => a.username.localeCompare(b.username)))
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
  }
}
