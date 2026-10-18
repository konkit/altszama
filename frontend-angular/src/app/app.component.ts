import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NavigationHistoryService} from './service/navigation-history.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
})
export class AppComponent {
  title = 'altszama-frontend';

  // Injected here so it starts tracking navigations from app start
  constructor(navigationHistory: NavigationHistoryService) {
  }
}
