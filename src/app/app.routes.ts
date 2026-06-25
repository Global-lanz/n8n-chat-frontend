import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { ChatContainerComponent } from './features/chat/chat-container/chat-container.component';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';
import { LocalUserMgmtGuard } from './core/guards/local-user-mgmt.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/chat', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'auth/callback',
    loadComponent: () => import('./features/auth/auth-callback/auth-callback.component').then(m => m.AuthCallbackComponent)
  },
  { path: 'chat', component: ChatContainerComponent, canActivate: [AuthGuard] },
  {
    path: 'settings',
    loadComponent: () => import('./features/settings/settings-page/settings-page.component').then(m => m.SettingsPageComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    canActivate: [AuthGuard, AdminGuard],
    children: [
      {
        path: '',
        redirectTo: 'users',
        pathMatch: 'full'
      },
      {
        path: 'users',
        canActivate: [LocalUserMgmtGuard],
        loadComponent: () => import('./features/admin/admin-users-page/admin-users-page.component').then(m => m.AdminUsersPageComponent)
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/admin/admin-settings/admin-settings.component').then(m => m.AdminSettingsComponent)
      }
    ]
  },
  { path: '**', redirectTo: '/chat' }
];

