import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import * as AppSelectors from '@store/selectors/app.selectors';

/**
 * Guards the local user-management screen (`/admin/users`). In external auth
 * mode users are managed centrally in the auth portal, so this screen is hidden
 * and any direct navigation is redirected back to the chat.
 *
 * The public config is loaded at app bootstrap; we wait until that request has
 * settled (config loaded OR failed) before deciding, so a deep-link/refresh
 * doesn't race the request. On failure we fail open (default `internal`),
 * preserving the original behavior for self-contained deployments.
 */
@Injectable({ providedIn: 'root' })
export class LocalUserMgmtGuard implements CanActivate {
  constructor(
    private store: Store,
    private router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.store.select(AppSelectors.selectConfigState).pipe(
      filter(state => state.config !== null || state.error !== null),
      take(1),
      map(state =>
        state.config?.authMode === 'external' ? this.router.createUrlTree(['/chat']) : true
      )
    );
  }
}
