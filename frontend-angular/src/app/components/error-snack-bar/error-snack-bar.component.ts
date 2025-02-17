import {Component, Inject} from '@angular/core';
import {MAT_SNACK_BAR_DATA} from '@angular/material/snack-bar';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-error-snack-bar',
  imports: [
    MatIcon
  ],
  standalone: true,
  templateUrl: './error-snack-bar.component.html',
  styleUrl: './error-snack-bar.component.scss'
})
export class ErrorSnackBarComponent {
  error: string = ""

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: { error: string }) {
    this.error = data.error;
  }
}
