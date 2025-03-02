import {Component} from '@angular/core';
import {RouterModule} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-landing-page-view',
  imports: [RouterModule, MatButtonModule],
  templateUrl: './landing-page-view.component.html',
  styleUrl: './landing-page-view.component.scss',
  standalone: true,
})
export class LandingPageViewComponent {

}
