import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { environment } from '@environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();

    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Only force a logout when an *authenticated* request (one that carried
        // a token) is rejected — that means the session really expired. A 401
        // from the login request itself (wrong password) has no token; it must
        // propagate so the login screen can show the error, instead of being
        // hijacked into a logout/redirect that hides it.
        if (error.status === 401 && token) {
          this.authService.logout();
          if (environment.authPortalUrl) {
            window.location.href = environment.authPortalUrl;
          }
        }
        return throwError(() => error);
      })
    );
  }
}
