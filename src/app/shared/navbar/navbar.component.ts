import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as AppActions from '@store/actions/app.actions';
import * as AppSelectors from '@store/selectors/app.selectors';
import { User } from '@core/models';

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
  botName$: Observable<string>;

  constructor(
    private store: Store,
    private router: Router
  ) {
    this.currentUser$ = this.store.select(AppSelectors.selectCurrentUser);
    this.isAdmin$ = this.store.select(AppSelectors.selectIsAdmin);
    this.botName$ = this.store.select(AppSelectors.selectBotName);
  }

  onLogout(): void {
    this.store.dispatch(AppActions.logout());
    this.router.navigate(['/login']);
  }
}
