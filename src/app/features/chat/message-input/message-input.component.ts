import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-message-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './message-input.component.html',
  styleUrls: ['./message-input.component.css']
})
export class MessageInputComponent implements OnDestroy {
  @Input() placeholder: string | null = 'Digite uma mensagem...';
  @Output() sendMessage = new EventEmitter<string>();
  @ViewChild('messageInput') messageInput!: ElementRef<HTMLTextAreaElement>;

  message = '';
  // Whether Enter should send (vs. insert a newline). Based on pointer/input
  // type, not viewport width — this app is meant to be embedded in a narrow
  // (~320px) drawer, where a real desktop keyboard+mouse would otherwise get
  // misclassified as "mobile" just for being in a small iframe.
  isDesktop = false;

  private readonly coarsePointerQuery = window.matchMedia('(pointer: coarse)');
  private readonly onPointerQueryChange = () => this.checkIsDesktop();

  constructor() {
    this.checkIsDesktop();
    this.coarsePointerQuery.addEventListener('change', this.onPointerQueryChange);
  }

  ngOnDestroy(): void {
    this.coarsePointerQuery.removeEventListener('change', this.onPointerQueryChange);
  }

  private checkIsDesktop(): void {
    this.isDesktop = !this.coarsePointerQuery.matches;
  }

  onKeyDown(event: KeyboardEvent): void {
    if (this.isDesktop) {
      // Mouse/trackpad (real keyboard, even inside a narrow embed): Enter envia, Shift+Enter quebra linha
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        this.onSend();
      }
    } else {
      // Touch primary (phone/tablet): Shift+Enter envia, Enter quebra linha
      if (event.key === 'Enter' && event.shiftKey) {
        event.preventDefault();
        this.onSend();
      }
    }
  }

  onSend(): void {
    const content = this.message.trim();
    if (content) {
      this.sendMessage.emit(content);
      this.message = '';
      this.autoResize();
    }
  }

  private readonly MAX_HEIGHT = 130;

  autoResize(): void {
    if (this.messageInput) {
      const element = this.messageInput.nativeElement;
      element.style.height = 'auto';
      const contentHeight = element.scrollHeight;
      element.style.height = Math.min(contentHeight, this.MAX_HEIGHT) + 'px';
      // Only show the scrollbar once content truly exceeds the cap — otherwise
      // it can flash in from sizing rounding even for a single short line.
      element.style.overflowY = contentHeight > this.MAX_HEIGHT ? 'auto' : 'hidden';
    }
  }
}
