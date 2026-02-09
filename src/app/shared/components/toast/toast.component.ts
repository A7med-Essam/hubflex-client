import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-4 right-4 z-50 space-y-2">
      @for (toast of toastService.toastsSignal(); track toast.id) {
        <div 
          class="flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm animate-slide-up max-w-sm"
          [ngClass]="{
            'bg-green-500/90 text-white': toast.type === 'success',
            'bg-red-500/90 text-white': toast.type === 'error',
            'bg-blue-500/90 text-white': toast.type === 'info',
            'bg-yellow-500/90 text-white': toast.type === 'warning'
          }">
          <div class="flex-1 font-medium">{{ toast.message }}</div>
          <button 
            (click)="toastService.remove(toast.id)"
            class="text-white/80 hover:text-white">
            ✕
          </button>
        </div>
      }
    </div>
  `
})
export class ToastComponent {
  toastService = inject(ToastService);
}