import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable, Subject, combineLatest } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { ApiService } from '@core/services';
import * as AppSelectors from '@store/selectors/app.selectors';
import * as AppActions from '@store/actions/app.actions';
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
export class AdminDashboardComponent implements OnInit, OnDestroy {
  users$: Observable<User[]>;
  conversations: UserConversation[] = [];
  selectedConversation: UserConversation | null = null;
  loading = false;
  
  private destroy$ = new Subject<void>();

  constructor(
    private store: Store,
    private apiService: ApiService
  ) {
    this.users$ = this.store.select(AppSelectors.selectUsers);
  }

  ngOnInit(): void {
    // Load users
    this.store.dispatch(AppActions.loadUsers());
    
    // Load all messages and organize by user
    this.loadConversations();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadConversations(): void {
    this.loading = true;
    
    combineLatest([
      this.users$,
      this.apiService.getAllMessages()
    ]).pipe(
      takeUntil(this.destroy$),
      map(([users, allMessages]) => {
        const conversationsMap = new Map<number, UserConversation>();
        
        // Group messages by user
        allMessages.forEach(msg => {
          const userId = msg.userId || msg.user_id;
          if (!userId) return;
          
          if (!conversationsMap.has(userId)) {
            const user = users.find(u => u.id === userId);
            if (user) {
              conversationsMap.set(userId, {
                user,
                messages: [],
                lastMessageAt: new Date(msg.timestamp)
              });
            }
          }
          
          const conv = conversationsMap.get(userId);
          if (conv) {
            conv.messages.push(msg);
            const msgDate = new Date(msg.timestamp);
            if (msgDate > conv.lastMessageAt) {
              conv.lastMessageAt = msgDate;
            }
          }
        });
        
        return Array.from(conversationsMap.values())
          .sort((a, b) => b.lastMessageAt.getTime() - a.lastMessageAt.getTime());
      })
    ).subscribe(conversations => {
      this.conversations = conversations;
      this.loading = false;
    });
  }

  selectConversation(conversation: UserConversation): void {
    this.selectedConversation = conversation;
  }

  formatDate(date: Date | string): string {
    return new Date(date).toLocaleString('pt-BR');
  }

  formatTimestamp(timestamp: string): string {
    return new Date(timestamp).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getTotalMessages(): number {
    return this.conversations.reduce((sum, c) => sum + c.messages.length, 0);
  }
}
