import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { ApiResponse, PaginatedResponse } from '../models/api-response.model';

export interface SupportChat {
  id: string;
  userId: string;
  userName: string;
  subject: string;
  status: SupportChatStatus;
  assignedToUserId?: string;
  assignedToUserName?: string;
  createdAt: string;
  resolvedAt?: string;
  closedAt?: string;
}

export interface SupportChatMessage {
  id: string;
  supportChatId: string;
  senderId: string;
  senderName: string;
  content: string;
  sentAt: string;
  isRead: boolean;
}

export enum SupportChatStatus {
  Open = 1,
  InProgress = 2,
  Resolved = 3,
  Closed = 4
}

@Injectable({
  providedIn: 'root'
})
export class SupportChatService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private hubConnection?: signalR.HubConnection;
  
  // Signals
  chatsSignal = signal<SupportChat[]>([]);
  currentChatSignal = signal<SupportChat | null>(null);
  messagesSignal = signal<SupportChatMessage[]>([]);
  connectedSignal = signal(false);
  typingSignal = signal<{ userName: string; isTyping: boolean } | null>(null);

  initializeConnection(): Promise<void> {
    const token = this.authService.getToken();
    
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.signalRUrl}/support-chat`, {
        accessTokenFactory: () => token || ''
      })
      .withAutomaticReconnect()
      .build();

    this.setupEventHandlers();

    return this.hubConnection.start()
      .then(() => {
        console.log('SignalR Connected');
        this.connectedSignal.set(true);
      })
      .catch(err => {
        console.error('SignalR Connection Error:', err);
        this.connectedSignal.set(false);
      });
  }

  private setupEventHandlers(): void {
    if (!this.hubConnection) return;

    this.hubConnection.on('ReceiveMessage', (message: SupportChatMessage) => {
      this.messagesSignal.update(messages => [...messages, message]);
    });

    this.hubConnection.on('UserTyping', (userName: string, isTyping: boolean) => {
      this.typingSignal.set({ userName, isTyping });
      
      if (isTyping) {
        setTimeout(() => {
          this.typingSignal.set(null);
        }, 3000);
      }
    });

    this.hubConnection.on('NewSupportChat', (chat: SupportChat) => {
      this.chatsSignal.update(chats => [chat, ...chats]);
    });

    this.hubConnection.on('ChatClosed', (chatId: string) => {
      this.chatsSignal.update(chats =>
        chats.map(chat =>
          chat.id === chatId ? { ...chat, status: SupportChatStatus.Closed } : chat
        )
      );
    });
  }

  disconnect(): void {
    this.hubConnection?.stop();
    this.connectedSignal.set(false);
  }

  // HTTP Methods
  createChat(subject: string, initialMessage: string): Observable<ApiResponse<SupportChat>> {
    return this.http.post<ApiResponse<SupportChat>>(
      `${environment.apiUrl}/supportchat`,
      { subject, initialMessage }
    );
  }

  getMyChats(pageNumber = 1, pageSize = 20): Observable<ApiResponse<PaginatedResponse<SupportChat>>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<ApiResponse<PaginatedResponse<SupportChat>>>(
      `${environment.apiUrl}/supportchat/my-chats`,
      { params }
    );
  }

  getChatMessages(chatId: string): Observable<ApiResponse<SupportChatMessage[]>> {
    return this.http.get<ApiResponse<SupportChatMessage[]>>(
      `${environment.apiUrl}/supportchat/${chatId}/messages`
    );
  }

  // SignalR Methods
  async joinChatRoom(chatId: string): Promise<void> {
    if (this.hubConnection?.state === signalR.HubConnectionState.Connected) {
      await this.hubConnection.invoke('JoinChatRoom', chatId);
    }
  }

  async leaveChatRoom(chatId: string): Promise<void> {
    if (this.hubConnection?.state === signalR.HubConnectionState.Connected) {
      await this.hubConnection.invoke('LeaveChatRoom', chatId);
    }
  }

  async sendMessage(chatId: string, message: string): Promise<void> {
    if (this.hubConnection?.state === signalR.HubConnectionState.Connected) {
      await this.hubConnection.invoke('SendMessage', chatId, message);
    }
  }

  async sendTypingIndicator(chatId: string, isTyping: boolean): Promise<void> {
    if (this.hubConnection?.state === signalR.HubConnectionState.Connected) {
      await this.hubConnection.invoke('TypingIndicator', chatId, isTyping);
    }
  }

  async markAsRead(chatId: string): Promise<void> {
    if (this.hubConnection?.state === signalR.HubConnectionState.Connected) {
      await this.hubConnection.invoke('MarkAsRead', chatId);
    }
  }
}