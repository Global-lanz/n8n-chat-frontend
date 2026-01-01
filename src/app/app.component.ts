import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NavbarComponent } from './shared/navbar/navbar.component';

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
  showNavbar = true;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Set initial state
    const currentUrl = this.router.url;
    this.showNavbar = !['/login', '/register'].includes(currentUrl);
    
    // Hide navbar on login/register pages
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.showNavbar = !['/login', '/register'].includes(event.url);
      });
  }
}
