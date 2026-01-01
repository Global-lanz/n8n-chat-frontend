import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from '@environments/environment';
import { Message } from '@core/models';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: Socket | null = null;
  private messageSubject = new Subject<Message>();
  public messages$ = this.messageSubject.asObservable();

  constructor(private authService: AuthService) {}

  connect(): void {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io(environment.apiBaseUrl);

    this.socket.on('connect', () => {
      const token = this.authService.getToken();
      if (token) {
        this.socket?.emit('authenticate', token);
      }
    });

    this.socket.on('new_message', (message: Message) => {
      if (message.sender === 'bot') {
        this.messageSubject.next(message);
      }
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}
