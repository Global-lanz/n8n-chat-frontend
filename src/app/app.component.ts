import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { AuthService } from './core/services/auth.service';
import * as AppActions from './store/actions/app.actions';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  template: `
    @if (showNavbar) {
      <app-navbar></app-navbar>
    }
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent implements OnInit {
  title = 'Chat N8N';
  showNavbar = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private store: Store
  ) {}

  ngOnInit(): void {
    // Validate token on app initialization to restore user state
    if (this.authService.isAuthenticated()) {
      this.store.dispatch(AppActions.validateToken());
    }

    // Set initial state based on authentication
    this.updateNavbarVisibility(this.router.url);
    
    // Update navbar visibility on route changes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.updateNavbarVisibility(event.url);
      });
  }

  private updateNavbarVisibility(url: string): void {
    const isAuthPage = ['/login', '/register'].includes(url);
    const isAuthenticated = this.authService.isAuthenticated();
    this.showNavbar = !isAuthPage && isAuthenticated;
  }
}
