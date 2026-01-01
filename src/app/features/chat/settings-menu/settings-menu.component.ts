import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ThemeService, Theme } from '@core/services/theme.service';
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
  @Output() close = new EventEmitter<void>();
  
  selectedTheme: Theme = 'dark';
  username = '';

  constructor(
    private themeService: ThemeService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.selectedTheme = this.themeService.getCurrentTheme();
    this.username = this.currentUser?.username || '';
  }

  onThemeChange(): void {
    this.themeService.setTheme(this.selectedTheme);
  }

  onUpdateName(): void {
    const newName = this.username.trim();
    if (!newName) {
      alert('Nome não pode estar vazio');
      return;
    }
    
    this.store.dispatch(AppActions.updateUsername({ username: newName }));
    alert('Nome atualizado com sucesso!');
  }
}
