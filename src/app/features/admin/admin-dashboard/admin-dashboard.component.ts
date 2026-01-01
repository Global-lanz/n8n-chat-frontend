import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as AppSelectors from '@store/selectors/app.selectors';
import { User, Message } from '@core/models';

interface UserConversation {
  user: User;
  messages: Message[];
  lastMessageAt: Date;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  users$: Observable<User[]>;
  conversations: UserConversation[] = [];
  selectedConversation: UserConversation | null = null;

  constructor(private store: Store) {
    this.users$ = this.store.select(AppSelectors.selectUsers);
  }

  ngOnInit(): void {
    // TODO: Implementar carregamento de conversas
    // Por enquanto, apenas mostra estrutura
  }

  selectConversation(conversation: UserConversation): void {
    this.selectedConversation = conversation;
  }

  formatDate(date: Date | string): string {
    return new Date(date).toLocaleString('pt-BR');
  }

  formatTimestamp(timestamp: string): string {
    return new Date(timestamp).toLocaleString('pt-BR');
  }
}
