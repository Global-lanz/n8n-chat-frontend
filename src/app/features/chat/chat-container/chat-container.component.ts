import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as AppActions from '@store/actions/app.actions';
import * as AppSelectors from '@store/selectors/app.selectors';
import { Message, User } from '@core/models';
import { WebSocketService, ThemeService } from '@core/services';
import { MessageListComponent } from '../message-list/message-list.component';
import { MessageInputComponent } from '../message-input/message-input.component';
import { BrandNameComponent } from '../../../shared/brand-name/brand-name.component';

@Component({
  selector: 'app-chat-container',
  standalone: true,
  imports: [
    CommonModule,
    MessageListComponent,
    MessageInputComponent,
    BrandNameComponent
  ],
  templateUrl: './chat-container.component.html',
  styleUrls: ['./chat-container.component.css']
})
export class ChatContainerComponent implements OnInit, OnDestroy {
  messages$: Observable<Message[]>;
  currentUser$: Observable<User | null>;
  botName$: Observable<string>;
  appLogo$: Observable<string | null>;
  welcomeMessage$: Observable<string>;
  inputPlaceholder$: Observable<string>;
  awaitingBotReply$: Observable<boolean>;

  private destroy$ = new Subject<void>();

  constructor(
    private store: Store,
    private webSocketService: WebSocketService,
    private themeService: ThemeService,
    private router: Router
  ) {
    this.messages$ = this.store.select(AppSelectors.selectMessages);
    this.currentUser$ = this.store.select(AppSelectors.selectCurrentUser);
    this.botName$ = this.store.select(AppSelectors.selectBotName);
    this.appLogo$ = this.themeService.activeLogo$(
      this.store.select(AppSelectors.selectAppLogo),
      this.store.select(AppSelectors.selectAppLogoDark)
    );
    this.welcomeMessage$ = this.store.select(AppSelectors.selectWelcomeMessage);
    this.inputPlaceholder$ = this.store.select(AppSelectors.selectInputPlaceholder);
    this.awaitingBotReply$ = this.store.select(AppSelectors.selectAwaitingBotReply);
  }

  ngOnInit(): void {
    this.store.dispatch(AppActions.loadConfig());
    this.store.dispatch(AppActions.loadMessages());

    // The chat screen manages its own internal scrolling (message list) and
    // expects the page itself to never scroll — but the global mobile
    // stylesheet re-enables body scrolling under 768px width (for other
    // screens, like long admin/settings forms). Below that width — real
    // phones, and this app's own ~320px embed drawer on any device — that
    // let a few stray pixels of layout slack turn into visible blank space
    // under the sticky input once the page scrolled. Locking body scroll
    // while this screen is mounted restores the same clipping desktop
    // already gets from the base `overflow: hidden`.
    document.body.classList.add('chat-locked');

    // Connect WebSocket and listen for messages
    this.webSocketService.connect();
    this.webSocketService.messages$
      .pipe(takeUntil(this.destroy$))
      .subscribe(message => {
        this.store.dispatch(AppActions.receiveMessage({ message }));
      });
  }

  ngOnDestroy(): void {
    document.body.classList.remove('chat-locked');
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
