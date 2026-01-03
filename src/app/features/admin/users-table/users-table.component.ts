import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '@core/models';

@Component({
  selector: 'app-users-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.css']
})
export class UsersTableComponent {
  @Input() users: User[] | null = [];
  @Input() loading: boolean | null = false;
  @Output() edit = new EventEmitter<User>();
  @Output() delete = new EventEmitter<User>();

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  formatLicenseExpires(dateString: string | null): string {
    if (!dateString) {
      return 'Sem limite';
    }
    
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  isExpired(dateString: string | null): boolean {
    if (!dateString) {
      return false;
    }
    
    return new Date(dateString) < new Date();
  }
}
