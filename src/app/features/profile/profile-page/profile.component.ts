import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-dark-900">
      <div class="container mx-auto px-4 py-8">
        
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-4xl font-bold text-white mb-2">My Profile</h1>
          <p class="text-gray-400">Manage your account settings</p>
        </div>

        <!-- Profile Card -->
        <div class="max-w-3xl mx-auto">
          <div class="bg-dark-800 rounded-xl p-8 border border-gray-700">
            
            <!-- Avatar & Name -->
            <div class="flex items-center gap-6 mb-8">
              <div class="w-24 h-24 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <span class="text-white text-3xl font-bold">
                  {{ authService.user()?.firstName!.charAt(0) }}{{ authService.user()?.lastName!.charAt(0) }}
                </span>
              </div>
              <div>
                <h2 class="text-2xl font-bold text-white mb-1">
                  {{ authService.user()?.firstName }} {{ authService.user()?.lastName }}
                </h2>
                <p class="text-gray-400">{{ authService.user()?.email }}</p>
              </div>
            </div>

            <!-- Quick Links -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                (click)="router.navigate(['/profile/watch-later'])"
                class="flex items-center gap-4 p-4 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors text-left">
                <div class="w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-white">Watch Later</h3>
                  <p class="text-sm text-gray-400">Your saved movies</p>
                </div>
              </button>

              <button
                (click)="router.navigate(['/profile/reviews'])"
                class="flex items-center gap-4 p-4 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors text-left">
                <div class="w-12 h-12 bg-yellow-600/20 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-white">My Reviews</h3>
                  <p class="text-sm text-gray-400">Reviews you've written</p>
                </div>
              </button>

              <button
                (click)="router.navigate(['/profile/subscription'])"
                class="flex items-center gap-4 p-4 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors text-left">
                <div class="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-white">Subscription</h3>
                  <p class="text-sm text-gray-400">Manage your plan</p>
                </div>
              </button>

              <button
                (click)="router.navigate(['/support'])"
                class="flex items-center gap-4 p-4 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors text-left">
                <div class="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-white">Support</h3>
                  <p class="text-sm text-gray-400">Get help</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProfileComponent {
  authService = inject(AuthService);
  router = inject(Router);
}