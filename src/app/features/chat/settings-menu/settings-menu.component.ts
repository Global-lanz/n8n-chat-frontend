import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ThemeService, Theme } from '@core/services/theme.service';
import { NotificationService } from '@core/services/notification.service';
import * as AppActions from '@store/actions/app.actions';
import { User } from '@core/models';

@Component({
  selector: 'app-settings-menu',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings-menu.component.html',
  styleUrls: ['./settings-menu.component.css']
})
export class SettingsMenuComponent implements OnInit {
  @Input() currentUser: User | null = null;
  @Input() standalone: boolean = false; // If true, don't show close button
  @Output() close = new EventEmitter<void>();
  
  selectedTheme: Theme = 'dark';
  username = '';
  
  // Password change
  newPassword = '';
  confirmPassword = '';
  showPasswordSection = false;

  constructor(
    private themeService: ThemeService,
    private store: Store,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    // Load theme from user profile or current theme
    if (this.currentUser?.theme) {
      this.selectedTheme = this.currentUser.theme as Theme;
    } else {
      this.selectedTheme = this.themeService.getCurrentTheme();
    }
    
    this.username = this.currentUser?.username || '';
  }

  onSaveSettings(): void {
    const newName = this.username.trim();
    if (!newName) {
      this.notificationService.error('Nome não pode estar vazio');
      return;
    }

    // Check if password change is requested
    if (this.showPasswordSection && (this.newPassword || this.confirmPassword)) {
      // Validate password fields
      if (!this.newPassword || !this.confirmPassword) {
        this.notificationService.error('Preencha a nova senha e a confirmação');
        return;
      }

      if (this.newPassword.length < 6) {
        this.notificationService.error('A nova senha deve ter no mínimo 6 caracteres');
        return;
      }

      if (this.newPassword !== this.confirmPassword) {
        this.notificationService.error('As senhas não conferem');
        return;
      }

      // Dispatch password change
      this.store.dispatch(AppActions.changePassword({ 
        newPassword: this.newPassword 
      }));

      this.clearPasswordFields();
      this.showPasswordSection = false;
    }

    // Apply theme immediately
    this.themeService.setTheme(this.selectedTheme);

    // Update username and theme in backend
    this.store.dispatch(AppActions.updateUsername({ 
      username: newName,
      theme: this.selectedTheme 
    }));
    
    this.notificationService.success('Configurações salvas com sucesso!');
  }

  togglePasswordSection(): void {
    this.showPasswordSection = !this.showPasswordSection;
    if (!this.showPasswordSection) {
      this.clearPasswordFields();
    }
  }

  private clearPasswordFields(): void {
    this.newPassword = '';
    this.confirmPassword = '';
  }
}
