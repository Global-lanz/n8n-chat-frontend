import { Component, Input, ViewChild, ElementRef, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import { Message } from '@core/models';

@Component({
  selector: 'app-message-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements AfterViewInit, OnChanges {
  @Input() messages: Message[] | null = [];
  @Input() botName: string | null = 'Bot';
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  private shouldScroll = false;
  private viewReady = false;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['messages']) {
      this.shouldScroll = true;
      this.scheduleScroll();
    }
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.scheduleScroll();
  }

  renderMarkdown(content: string): SafeHtml {
    const html = marked.parse(content) as string;
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  formatTime(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  private scrollToBottom(): void {
    if (this.messagesContainer) {
      const element = this.messagesContainer.nativeElement;
      element.scrollTo({
        top: element.scrollHeight,
        behavior: 'smooth'
      });
    }
  }

  private scheduleScroll(): void {
    if (!this.viewReady || !this.shouldScroll) {
      return;
    }

    requestAnimationFrame(() => {
      this.scrollToBottom();
      this.shouldScroll = false;
    });
  }
}
