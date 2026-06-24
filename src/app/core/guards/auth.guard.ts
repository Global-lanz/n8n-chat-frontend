import { Injectable } from '@angular/core';
import { Router, CanActivate, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.authService.isAuthenticated()) {
      return this.redirectToLogin();
    }

    return this.authService.validateToken().pipe(
      map(isValid => {
        if (isValid) {
          return true;
        }
        return this.redirectToLogin();
      }),
      catchError(() => {
        return of(this.redirectToLogin());
      })
    );
  }

  private redirectToLogin(): false | UrlTree {
    if (environment.authPortalUrl) {
      window.location.href = environment.authPortalUrl;
      return false;
    }
    return this.router.createUrlTree(['/login']);
  }
}
