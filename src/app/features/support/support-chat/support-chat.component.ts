import { Component, inject, signal, OnInit, OnDestroy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupportChatService, SupportChat, SupportChatMessage, SupportChatStatus } from '../../../core/services/support-chat.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-support-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent],
  template: `
    <div class="min-h-screen bg-dark-900">
      <div class="container mx-auto px-4 py-8">
        
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-4xl font-bold text-white mb-2">Support Chat</h1>
          <p class="text-gray-400">Get help from our support team</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <!-- Chat List -->
          <div class="bg-dark-800 rounded-lg border border-gray-700 overflow-hidden">
            <div class="p-4 border-b border-gray-700">
              <button 
                (click)="showNewChatForm.set(true)"
                class="w-full py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors">
                + New Chat
              </button>
            </div>

            <div class="overflow-y-auto max-h-[600px]">
              @if (loadingChats()) {
                <div class="p-8">
                  <app-loading-spinner text="Loading chats..." containerClass="py-4" />
                </div>
              } @else if (supportChatService.chatsSignal().length === 0) {
                <div class="p-8 text-center">
                  <p class="text-gray-400">No chats yet</p>
                </div>
              } @else {
                @for (chat of supportChatService.chatsSignal(); track chat.id) {
                  <div 
                    (click)="selectChat(chat)"
                    [class.bg-dark-700]="selectedChatId() === chat.id"
                    class="p-4 border-b border-gray-700 cursor-pointer hover:bg-dark-700 transition-colors">
                    <div class="flex items-start justify-between mb-2">
                      <h3 class="font-semibold text-white line-clamp-1">{{ chat.subject }}</h3>
                      <span 
                        class="px-2 py-1 text-xs rounded-full"
                        [ngClass]="{
                          'bg-green-500/20 text-green-400': chat.status === 1,
                          'bg-blue-500/20 text-blue-400': chat.status === 2,
                          'bg-gray-500/20 text-gray-400': chat.status === 3 || chat.status === 4
                        }">
                        {{ getStatusName(chat.status) }}
                      </span>
                    </div>
                    <p class="text-sm text-gray-400">{{ formatDate(chat.createdAt) }}</p>
                  </div>
                }
              }
            </div>
          </div>

          <!-- Chat Window -->
          <div class="lg:col-span-2 bg-dark-800 rounded-lg border border-gray-700 flex flex-col" style="height: 700px;">
            
            @if (showNewChatForm()) {
              <!-- New Chat Form -->
              <div class="p-6 space-y-4">
                <div class="flex items-center justify-between mb-4">
                  <h2 class="text-xl font-bold text-white">Start New Chat</h2>
                  <button 
                    (click)="showNewChatForm.set(false)"
                    class="text-gray-400 hover:text-white">
                    ✕
                  </button>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                  <input
                    type="text"
                    [(ngModel)]="newChatSubject"
                    placeholder="What do you need help with?"
                    class="w-full px-4 py-2 bg-dark-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600">
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Message</label>
                  <textarea
                    [(ngModel)]="newChatMessage"
                    rows="6"
                    placeholder="Describe your issue..."
                    class="w-full px-4 py-2 bg-dark-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 resize-none"></textarea>
                </div>

                <button
                  (click)="createNewChat()"
                  [disabled]="!newChatSubject.trim() || !newChatMessage.trim()"
                  class="w-full py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  Start Chat
                </button>
              </div>
            } @else if (selectedChatId()) {
              <!-- Chat Messages -->
              <div class="flex-1 flex flex-col">
                
                <!-- Chat Header -->
                <div class="p-4 border-b border-gray-700">
                  <h2 class="text-lg font-semibold text-white">
                    {{ supportChatService.currentChatSignal()?.subject }}
                  </h2>
                  <p class="text-sm text-gray-400">
                    Status: {{ getStatusName(supportChatService.currentChatSignal()?.status!) }}
                  </p>
                </div>

                <!-- Messages -->
                <div class="flex-1 overflow-y-auto p-4 space-y-4">
                  @if (loadingMessages()) {
                    <app-loading-spinner text="Loading messages..." containerClass="py-8" />
                  } @else {
                    @for (message of supportChatService.messagesSignal(); track message.id) {
                      <div 
                        [class.justify-end]="message.senderId === authService.user()?.id"
                        class="flex">
                        <div 
                          [class.bg-red-600]="message.senderId === authService.user()?.id"
                          [class.bg-dark-700]="message.senderId !== authService.user()?.id"
                          class="max-w-[70%] rounded-lg p-4">
                          <p class="text-sm font-medium text-white/80 mb-1">{{ message.senderName }}</p>
                          <p class="text-white">{{ message.content }}</p>
                          <p class="text-xs text-white/60 mt-2">{{ formatTime(message.sentAt) }}</p>
                        </div>
                      </div>
                    }

                    <!-- Typing Indicator -->
                    @if (supportChatService.typingSignal()?.isTyping) {
                      <div class="flex">
                        <div class="bg-dark-700 rounded-lg p-4">
                          <p class="text-sm text-gray-400">
                            {{ supportChatService.typingSignal()?.userName }} is typing...
                          </p>
                        </div>
                      </div>
                    }
                  }
                </div>

                <!-- Message Input -->
                @if (supportChatService.currentChatSignal()?.status !== 4) {
                  <div class="p-4 border-t border-gray-700">
                    <div class="flex items-end gap-2">
                      <textarea
                        [(ngModel)]="newMessage"
                        (ngModelChange)="onTyping()"
                        (keydown.enter)="onEnterPress($event)"
                        rows="2"
                        placeholder="Type your message..."
                        class="flex-1 px-4 py-2 bg-dark-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 resize-none"></textarea>
                      <button
                        (click)="sendMessage()"
                        [disabled]="!newMessage.trim() || !supportChatService.connectedSignal()"
                        class="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed h-[68px]">
                        Send
                      </button>
                    </div>
                    
                    @if (!supportChatService.connectedSignal()) {
                      <p class="text-sm text-red-400 mt-2">Disconnected. Reconnecting...</p>
                    }
                  </div>
                }
              </div>
            } @else {
              <!-- Empty State -->
              <div class="flex-1 flex items-center justify-center">
                <div class="text-center">
                  <svg class="w-24 h-24 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                  </svg>
                  <p class="text-gray-400">Select a chat or start a new one</p>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `
})
export class SupportChatComponent implements OnInit, OnDestroy {
  supportChatService = inject(SupportChatService);
  authService = inject(AuthService);
  private toastService = inject(ToastService);

  loadingChats = signal(false);
  loadingMessages = signal(false);
  selectedChatId = signal<string | null>(null);
  showNewChatForm = signal(false);

  newChatSubject = '';
  newChatMessage = '';
  newMessage = '';
  
  private typingTimeout?: number;

  constructor() {
    // Auto-scroll to bottom when new message arrives
    effect(() => {
      const messages = this.supportChatService.messagesSignal();
      if (messages.length > 0) {
        setTimeout(() => this.scrollToBottom(), 100);
      }
    });
  }

  async ngOnInit(): Promise<void> {
    await this.supportChatService.initializeConnection();
    this.loadChats();
  }

  ngOnDestroy(): void {
    if (this.selectedChatId()) {
      this.supportChatService.leaveChatRoom(this.selectedChatId()!);
    }
    this.supportChatService.disconnect();
  }

  loadChats(): void {
    this.loadingChats.set(true);
    this.supportChatService.getMyChats().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.supportChatService.chatsSignal.set(response.data.items);
        }
        this.loadingChats.set(false);
      },
      error: () => {
        this.loadingChats.set(false);
        this.toastService.error('Failed to load chats');
      }
    });
  }

  async selectChat(chat: SupportChat): Promise<void> {
    // Leave previous chat room
    if (this.selectedChatId()) {
      await this.supportChatService.leaveChatRoom(this.selectedChatId()!);
    }

    this.selectedChatId.set(chat.id);
    this.supportChatService.currentChatSignal.set(chat);
    this.showNewChatForm.set(false);

    // Join chat room
    await this.supportChatService.joinChatRoom(chat.id);

    // Load messages
    this.loadingMessages.set(true);
    this.supportChatService.getChatMessages(chat.id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.supportChatService.messagesSignal.set(response.data);
        }
        this.loadingMessages.set(false);
      },
      error: () => {
        this.loadingMessages.set(false);
        this.toastService.error('Failed to load messages');
      }
    });

    // Mark as read
    await this.supportChatService.markAsRead(chat.id);
  }

  createNewChat(): void {
    if (!this.newChatSubject.trim() || !this.newChatMessage.trim()) return;

    this.supportChatService.createChat(this.newChatSubject, this.newChatMessage).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.toastService.success('Chat created successfully');
          this.newChatSubject = '';
          this.newChatMessage = '';
          this.showNewChatForm.set(false);
          this.loadChats();
          this.selectChat(response.data);
        }
      },
      error: () => {
        this.toastService.error('Failed to create chat');
      }
    });
  }

  async sendMessage(): Promise<void> {
    if (!this.newMessage.trim() || !this.selectedChatId()) return;

    await this.supportChatService.sendMessage(this.selectedChatId()!, this.newMessage);
    this.newMessage = '';
  }

  async onTyping(): Promise<void> {
    if (!this.selectedChatId()) return;

    await this.supportChatService.sendTypingIndicator(this.selectedChatId()!, true);

    // Clear previous timeout
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }

    // Set new timeout to stop typing indicator
    this.typingTimeout = window.setTimeout(async () => {
      await this.supportChatService.sendTypingIndicator(this.selectedChatId()!, false);
    }, 1000);
  }

  onEnterPress(event: Event): void {
  const keyboardEvent = event as KeyboardEvent;

    if (keyboardEvent.shiftKey) return; // Allow Shift+Enter for new line
    
    event.preventDefault();
    this.sendMessage();
  }


  private scrollToBottom(): void {
    // Implement scroll to bottom logic
  }

  getStatusName(status: SupportChatStatus): string {
    const names = ['', 'Open', 'In Progress', 'Resolved', 'Closed'];
    return names[status] || 'Unknown';
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  formatTime(date: string): string {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });
  }
}