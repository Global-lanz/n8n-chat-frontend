import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { ApiService } from '@core/services/api.service';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  template: `
    <div style="display:flex;align-items:center;justify-content:center;height:100vh;">
      <p>Autenticando...</p>
    </div>
  `,
})
export class AuthCallbackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (token) {
      localStorage.setItem('token', token);
      this.apiService.getCurrentUser().subscribe({
        next: (response) => {
          this.authService.updateCurrentUser(response.user);
          window.location.href = '/chat';
        },
        error: () => {
          this.authService.logout();
          this.router.navigate(['/login']);
        },
      });
    } else {
      this.router.navigate(['/login']);
    }
  }
}
