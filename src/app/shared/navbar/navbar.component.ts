import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as AppActions from '@store/actions/app.actions';
import * as AppSelectors from '@store/selectors/app.selectors';
import { User } from '@core/models';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  currentUser$: Observable<User | null>;
  isAdmin$: Observable<boolean>;
  /** True only in self-contained (internal) auth mode. In external mode user
   * management lives in the central auth portal, so the local Users screen is hidden. */
  localUserMgmt$: Observable<boolean>;
  /** Central auth portal home URL (set only in external/SSO mode). */
  portalUrl = environment.authPortalUrl;
  menuOpen = false;

  constructor(private store: Store) {
    this.currentUser$ = this.store.select(AppSelectors.selectCurrentUser);
    this.isAdmin$ = this.store.select(AppSelectors.selectIsAdmin);
    this.localUserMgmt$ = this.store.select(AppSelectors.selectAuthMode).pipe(
      map(mode => mode !== 'external')
    );
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  onLogout(): void {
    this.menuOpen = false;
    // Navigation is handled by the logout effect: in external mode it
    // redirects to the central portal's /logout (SSO single logout); in
    // internal mode it routes back to /login.
    this.store.dispatch(AppActions.logout());
  }
}
