import { Component, Input, ViewChild, ElementRef, AfterViewChecked, OnChanges } from '@angular/core';
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
export class MessageListComponent implements AfterViewChecked, OnChanges {
  @Input() messages: Message[] | null = [];
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  
  private shouldScroll = false;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnChanges(): void {
    this.shouldScroll = true;
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  renderMarkdown(content: string): SafeHtml {
    const cleanContent = content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line)
      .join('\n')
      .trim();
    
    const html = marked.parse(cleanContent) as string;
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
      element.scrollTop = element.scrollHeight;
    }
  }
}
