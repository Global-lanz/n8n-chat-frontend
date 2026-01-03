import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsMenuComponent } from '../../chat/settings-menu/settings-menu.component';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as AppSelectors from '@store/selectors/app.selectors';
import { User } from '@core/models';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [CommonModule, SettingsMenuComponent],
  template: `
    <div class="settings-page">
      <div class="settings-header">
        <h1>⚙️ Configurações</h1>
        <p class="subtitle">Gerencie suas preferências e informações pessoais</p>
      </div>
      <div class="settings-content">
        <app-settings-menu
          [currentUser]="currentUser$ | async"
          [standalone]="true"
        ></app-settings-menu>
      </div>
    </div>
  `,
  styles: [`
    .settings-page {
      padding: 2rem;
      padding-top: 3rem;
      max-width: 800px;
      margin: 0 auto;
      min-height: calc(100vh - 80px);
    }

    .settings-header {
      margin-bottom: 2rem;
      padding: 2rem;
      background: var(--bg-secondary);
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .settings-header h1 {
      margin: 0 0 0.5rem 0;
      color: var(--text-primary);
      font-weight: 700;
      font-size: 2rem;
    }

    .subtitle {
      margin: 0;
      color: var(--text-secondary);
      font-size: 1rem;
    }

    .settings-content {
      background: var(--bg-secondary);
      border-radius: 12px;
      padding: 0;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    @media (max-width: 768px) {
      .settings-page {
        padding: 1rem;
      }
      
      .settings-header {
        padding: 1.5rem;
      }
      
      .settings-header h1 {
        font-size: 1.5rem;
      }
    }
  `]
})
export class SettingsPageComponent {
  currentUser$: Observable<User | null>;

  constructor(private store: Store) {
    this.currentUser$ = this.store.select(AppSelectors.selectCurrentUser);
  }
}
