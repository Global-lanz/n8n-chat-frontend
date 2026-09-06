import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-message-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './message-input.component.html',
  styleUrls: ['./message-input.component.css']
})
export class MessageInputComponent {
  @Input() placeholder: string | null = 'Digite uma mensagem...';
  @Output() sendMessage = new EventEmitter<string>();
  @ViewChild('messageInput') messageInput!: ElementRef<HTMLTextAreaElement>;
  
  message = '';
  isDesktop = false;

  constructor() {
    this.checkIsDesktop();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.checkIsDesktop();
  }

  private checkIsDesktop(): void {
    this.isDesktop = window.innerWidth > 768;
  }

  onKeyDown(event: KeyboardEvent): void {
    if (this.isDesktop) {
      // Desktop: Enter envia, Shift+Enter quebra linha
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        this.onSend();
      }
    } else {
      // Mobile: Shift+Enter envia, Enter quebra linha
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
