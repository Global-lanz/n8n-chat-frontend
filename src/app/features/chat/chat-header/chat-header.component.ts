import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-header.component.html',
  styleUrls: ['./chat-header.component.css']
})
export class ChatHeaderComponent {
  @Input() botName: string | null = 'NorteIA';
  @Input() isAdmin: boolean | null = false;
  @Output() toggleAdmin = new EventEmitter<void>();
  @Output() toggleSettings = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();
}
