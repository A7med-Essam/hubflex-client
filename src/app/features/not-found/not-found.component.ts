import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-dark-900 flex items-center justify-center px-4">
      <div class="text-center max-w-lg animate-fade-in">
        <!-- 404 Animation -->
        <div class="mb-8">
          <h1 class="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800 mb-4">
            404
          </h1>
          <div class="relative">
            <svg class="w-64 h-64 mx-auto text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
        </div>

        <!-- Message -->
        <h2 class="text-3xl font-bold text-white mb-4">
          Oops! Page Not Found
        </h2>
        <p class="text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            (click)="goBack()"
            class="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
            Go Back
          </button>
          <button
            (click)="goHome()"
            class="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            Go to Home
          </button>
        </div>
      </div>
    </div>
  `
})
export class NotFoundComponent {
  private router = inject(Router);

  goBack(): void {
    window.history.back();
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }
}