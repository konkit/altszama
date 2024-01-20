import {Component, Inject} from '@angular/core';
import {MAT_SNACK_BAR_DATA} from "@angular/material/snack-bar";
import {MatIconModule} from '@angular/material/icon';

@Component({
    selector: 'app-error-snack-bar',
    templateUrl: './error-snack-bar.component.html',
    styleUrls: ['./error-snack-bar.component.scss'],
    standalone: true,
    imports: [MatIconModule]
})
export class ErrorSnackBarComponent {

  error: string = ""

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: { error: string }) {
    this.error = data.error;
  }
}
