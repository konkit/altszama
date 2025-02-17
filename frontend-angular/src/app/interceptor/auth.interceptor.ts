import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {AuthService} from "../service/auth.service";
import {Router} from "@angular/router";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const loggedUser = this.authService.getLoggedUser()
    if (loggedUser != null) {
      request = request.clone({
        setHeaders: {
          Authorization: "Bearer " + loggedUser.token
        }
      })
    }

    return next.handle(request).pipe(
      catchError(err => {
        if (err.status === 401) {
          this.authService.logoutAndNavigateToLoginPage();
        }
        const error = err.error?.message || err.statusText;
        return throwError(error);
      })
    )
  }
}
