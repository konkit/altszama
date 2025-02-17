import {Component} from '@angular/core';
import {GoogleLoginButtonComponent} from './components/google-login-button/google-login-button.component';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-login-view',
  templateUrl: './login-view.component.html',
  styleUrl: './login-view.component.scss',
  standalone: true,
  imports: [MatCardModule, GoogleLoginButtonComponent]
})
export class LoginViewComponent {

}
