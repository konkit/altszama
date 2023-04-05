import {Injectable} from '@angular/core';
import {MatSnackBar, MatSnackBarConfig} from "@angular/material/snack-bar";
import {ErrorSnackBarComponent} from "../components/error-snack-bar/error-snack-bar.component";

@Injectable({
  providedIn: 'root'
})
export class ErrorSnackBarService {

  constructor(private matSnackBar: MatSnackBar) { }

  displayError(error: any) {
    let config: MatSnackBarConfig = {
      duration: 5 * 1000,
      horizontalPosition: 'left',
      data: {
        error: error
      }
    };
    this.matSnackBar.openFromComponent(ErrorSnackBarComponent, config)
  }
}
