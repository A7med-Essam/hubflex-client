import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (show()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
        <!-- Backdrop -->
        <div 
          class="absolute inset-0 bg-black/60 backdrop-blur-sm"
          (click)="onCancel()">
        </div>

        <!-- Dialog -->
        <div class="relative bg-dark-800 rounded-xl shadow-2xl border border-gray-700 max-w-md w-full animate-scale-in">
          <!-- Header -->
          <div class="p-6 border-b border-gray-700">
            <div class="flex items-center gap-3">
              @if (type() === 'warning') {
                <div class="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <svg class="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                  </svg>
                </div>
              } @else if (type() === 'danger') {
                <div class="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                  <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
              }
              <h3 class="text-xl font-bold text-white">{{ title() }}</h3>
            </div>
          </div>

          <!-- Body -->
          <div class="p-6">
            <p class="text-gray-300 mb-4">{{ message() }}</p>
            
            @if (showInput()) {
              <div>
                <label class="block text-sm font-medium text-gray-400 mb-2">
                  {{ inputLabel() }}
                </label>
                <textarea
                  [(ngModel)]="inputValue"
                  [placeholder]="inputPlaceholder()"
                  rows="3"
                  class="w-full px-4 py-2 bg-dark-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 resize-none">
                </textarea>
              </div>
            }
          </div>

          <!-- Footer -->
          <div class="p-6 border-t border-gray-700 flex items-center justify-end gap-3">
            <button
              (click)="onCancel()"
              class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
              {{ cancelText() }}
            </button>
            <button
              (click)="onConfirm()"
              class="px-6 py-2 rounded-lg text-white transition-colors"
              [class.bg-red-600]="type() === 'danger'"
              [class.hover:bg-red-700]="type() === 'danger'"
              [class.bg-yellow-600]="type() === 'warning'"
              [class.hover:bg-yellow-700]="type() === 'warning'">
              {{ confirmText() }}
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class ConfirmationDialogComponent {
  show = input<boolean>(false);
  title = input<string>('Confirm Action');
  message = input<string>('Are you sure?');
  type = input<'warning' | 'danger'>('warning');
  confirmText = input<string>('Confirm');
  cancelText = input<string>('Cancel');
  showInput = input<boolean>(false);
  inputLabel = input<string>('');
  inputPlaceholder = input<string>('');

  confirm = output<string>();
  cancel = output<void>();

  inputValue = '';

  onConfirm(): void {
    this.confirm.emit(this.inputValue);
    this.inputValue = '';
  }

  onCancel(): void {
    this.cancel.emit();
    this.inputValue = '';
  }
}