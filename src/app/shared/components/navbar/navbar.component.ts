import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="fixed top-0 left-0 right-0 z-40 bg-dark-900/95 backdrop-blur-md border-b border-gray-800">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          
          <!-- Logo -->
          <div class="flex items-center gap-8">
            <a routerLink="/" class="flex items-center gap-2">
              <div class="w-8 h-8 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-xl">H</span>
              </div>
              <span class="text-xl font-bold text-white">HubFlex</span>
            </a>

            <!-- Main Navigation -->
            @if (authService.isAuthenticated()) {
              <div class="hidden md:flex items-center gap-6">
                <a 
                  routerLink="/home" 
                  routerLinkActive="text-red-500"
                  class="text-gray-300 hover:text-white transition-colors">
                  Home
                </a>
                <a 
                  routerLink="/movies" 
                  routerLinkActive="text-red-500"
                  class="text-gray-300 hover:text-white transition-colors">
                  Movies
                </a>
                <a 
                  routerLink="/profile/watch-later" 
                  routerLinkActive="text-red-500"
                  class="text-gray-300 hover:text-white transition-colors">
                  My List
                </a>
                @if (authService.isAdmin()) {
                  <a 
                    routerLink="/admin/dashboard" 
                    routerLinkActive="text-red-500"
                    class="text-yellow-400 hover:text-yellow-300 transition-colors">
                    Admin
                  </a>
                }
              </div>
            }
          </div>

          <!-- Right side -->
          <div class="flex items-center gap-4">
            @if (authService.isAuthenticated()) {
              <!-- Search Icon -->
              <button class="text-gray-300 hover:text-white p-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </button>

              <!-- Support Chat -->
              <button 
                (click)="router.navigate(['/support'])"
                class="text-gray-300 hover:text-white p-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
                </svg>
              </button>

              <!-- User Menu -->
              <div class="relative">
                <button 
                  (click)="toggleUserMenu()"
                  class="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <div class="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                    <span class="text-white text-sm font-semibold">
                      {{ authService.user()?.firstName?.charAt(0) }}{{ authService.user()?.lastName?.charAt(0) }}
                    </span>
                  </div>
                </button>

                <!-- Dropdown -->
                @if (showUserMenu()) {
                  <div class="bg-list absolute right-0 mt-2 w-56 bg-dark-800 rounded-lg shadow-xl border border-gray-700 py-2 animate-fade-in">
                    <div class="px-4 py-3 border-b border-gray-700">
                      <p class="text-sm font-medium text-white">
                        {{ authService.user()?.firstName }} {{ authService.user()?.lastName }}
                      </p>
                      <p class="text-xs text-gray-400">{{ authService.user()?.email }}</p>
                      @if (authService.user()?.currentSubscription) {
                        <span class="mt-2 inline-block px-2 py-1 text-xs font-medium rounded bg-yellow-500/20 text-yellow-400">
                          {{ authService.user()?.currentSubscription?.planName }}
                        </span>
                      }
                    </div>

                    <a 
                      routerLink="/profile" 
                      (click)="closeUserMenu()"
                      class="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
                      My Profile
                    </a>
                    <a 
                      routerLink="/profile/watch-later" 
                      (click)="closeUserMenu()"
                      class="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
                      Watch Later
                    </a>
                    <a 
                      routerLink="/profile/reviews" 
                      (click)="closeUserMenu()"
                      class="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
                      My Reviews
                    </a>
                    <a 
                      routerLink="/profile/subscription" 
                      (click)="closeUserMenu()"
                      class="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
                      Subscription
                    </a>

                    <div class="border-t border-gray-700 my-2"></div>

                    <button 
                      (click)="logout()"
                      class="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700">
                      Sign Out
                    </button>
                  </div>
                }
              </div>
            } @else {
              <!-- Not authenticated -->
              <a 
                routerLink="/auth/login"
                class="px-4 py-2 text-sm font-medium text-white hover:text-gray-300 transition-colors">
                Sign In
              </a>
              <a 
                routerLink="/auth/register"
                class="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                Get Started
              </a>
            }

            <!-- Mobile Menu Button -->
            <button 
              (click)="toggleMobileMenu()"
              class="md:hidden text-gray-300 hover:text-white">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      @if (showMobileMenu()) {
        <div class="md:hidden bg-dark-800 border-t border-gray-700 animate-slide-up">
          <div class="px-4 py-3 space-y-2">
            <a routerLink="/home" class="block py-2 text-gray-300 hover:text-white">Home</a>
            <a routerLink="/movies" class="block py-2 text-gray-300 hover:text-white">Movies</a>
            <a routerLink="/profile/watch-later" class="block py-2 text-gray-300 hover:text-white">My List</a>
          </div>
        </div>
      }
    </nav>

    <!-- Spacer to prevent content from going under fixed navbar -->
    <div class="h-16"></div>
  `,
  styles: [`
    .bg-list {
      background-color:#585858;
    }
    `]
})
export class NavbarComponent {
  authService = inject(AuthService);
  router = inject(Router);

  showUserMenu = signal(false);
  showMobileMenu = signal(false);

  toggleUserMenu(): void {
    this.showUserMenu.update(v => !v);
  }

  closeUserMenu(): void {
    this.showUserMenu.set(false);
  }

  toggleMobileMenu(): void {
    this.showMobileMenu.update(v => !v);
  }

  logout(): void {
    this.closeUserMenu();
    this.authService.logout();
  }
}