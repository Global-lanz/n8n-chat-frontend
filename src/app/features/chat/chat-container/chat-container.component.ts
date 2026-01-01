import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as AppActions from '@store/actions/app.actions';
import * as AppSelectors from '@store/selectors/app.selectors';
import { Message, User } from '@core/models';
import { WebSocketService } from '@core/services';
import { MessageListComponent } from '../message-list/message-list.component';
import { MessageInputComponent } from '../message-input/message-input.component';
import { SettingsMenuComponent } from '../settings-menu/settings-menu.component';

@Component({
  selector: 'app-chat-container',
  standalone: true,
  imports: [
    CommonModule,
    MessageListComponent,
    MessageInputComponent,
    SettingsMenuComponent
  ],
  templateUrl: './chat-container.component.html',
  styleUrls: ['./chat-container.component.css']
})
export class ChatContainerComponent implements OnInit, OnDestroy {
  messages$: Observable<Message[]>;
  currentUser$: Observable<User | null>;
  botName$: Observable<string>;
  
  showSettings = false;
  
  private destroy$ = new Subject<void>();

  constructor(
    private store: Store,
    private webSocketService: WebSocketService,
    private router: Router
  ) {
    this.messages$ = this.store.select(AppSelectors.selectMessages);
    this.currentUser$ = this.store.select(AppSelectors.selectCurrentUser);
    this.botName$ = this.store.select(AppSelectors.selectBotName);
  }

  ngOnInit(): void {
    this.store.dispatch(AppActions.loadConfig());
    this.store.dispatch(AppActions.loadMessages());
    
    // Connect WebSocket and listen for messages
    this.webSocketService.connect();
    this.webSocketService.messages$
      .pipe(takeUntil(this.destroy$))
      .subscribe(message => {
        this.store.dispatch(AppActions.receiveMessage({ message }));
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.webSocketService.disconnect();
  }

  onSendMessage(content: string): void {
    const message: Message = {
      sender: 'user',
      content,
      timestamp: new Date().toISOString()
    };
    this.store.dispatch(AppActions.addMessage({ message }));
    this.store.dispatch(AppActions.sendMessage({ content }));
  }
}
