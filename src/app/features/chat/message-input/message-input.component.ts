import { Component, Output, EventEmitter, ViewChild, ElementRef, HostListener } from '@angular/core';
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

  autoResize(): void {
    if (this.messageInput) {
      const element = this.messageInput.nativeElement;
      element.style.height = 'auto';
      element.style.height = Math.min(element.scrollHeight, 120) + 'px';
    }
  }
}
