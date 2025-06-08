import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { AuthService } from '../../service/auth.service';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav, MatSidenavContainer, MatSidenavModule } from '@angular/material/sidenav';
import { MatListItem, MatListModule, MatNavList } from '@angular/material/list';
import { MatDivider } from '@angular/material/divider';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'app-authenticated-layout',
  imports: [
    MatToolbar,
    MatIconModule,
    MatSidenavContainer,
    MatSidenavModule,
    MatNavList,
    MatListItem,
    RouterLink,
    MatSidenav,
    MatDivider,
    RouterOutlet,
    MatIconButton,
    RouterLinkActive,
    MatListModule
  ],
  standalone: true,
  templateUrl: './authenticated-layout.component.html',
  styleUrl: './authenticated-layout.component.scss'
})
export class AuthenticatedLayoutComponent implements OnInit, OnDestroy {

  username: string = ""

  protected readonly isMobile = signal(true);

  private readonly _mobileQuery: MediaQueryList;
  private readonly _mobileQueryListener: () => void;

  private authService = inject(AuthService);

  constructor() {
    const media = inject(MediaMatcher);

    this._mobileQuery = media.matchMedia('(max-width: 1024px)');
    this.isMobile.set(this._mobileQuery.matches);
    this._mobileQueryListener = () => this.isMobile.set(this._mobileQuery.matches);
    this._mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  ngOnInit() {
    this.username = this.authService.getLoggedUser()?.username || ""
  }

  ngOnDestroy(): void {
    this._mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }

  logout() {
    this.authService.logoutAndNavigateToLoginPage()
  }
}
