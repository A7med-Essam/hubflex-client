import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center justify-center" [class]="containerClass()">
      <div class="relative">
        <div class="w-12 h-12 rounded-full border-4 border-gray-700 border-t-red-600 animate-spin"></div>
        @if (text()) {
          <p class="mt-4 text-gray-400 text-sm">{{ text() }}</p>
        }
      </div>
    </div>
  `
})
export class LoadingSpinnerComponent {
  text = input<string>('');
  containerClass = input<string>('py-20');
}