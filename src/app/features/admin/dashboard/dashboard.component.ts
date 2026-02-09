import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AdminStatsService, DashboardStats } from '../../../core/services/admin-stats.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  template: `
    <div class="min-h-screen bg-dark-900">
      <div class="container mx-auto px-4 py-8">
        
        <!-- Header -->
        <div class="flex items-center justify-between mb-8">
          <div>
            <h1 class="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p class="text-gray-400">Platform overview and statistics</p>
          </div>
          
          <div class="flex items-center gap-4">
            <button 
              (click)="router.navigate(['/admin/movies'])"
              class="px-4 py-2 bg-dark-700 text-white rounded-lg hover:bg-dark-600 transition-colors">
              Manage Movies
            </button>
            <button 
              (click)="router.navigate(['/admin/genres'])"
              class="px-4 py-2 bg-dark-700 text-white rounded-lg hover:bg-dark-600 transition-colors">
              Manage Genres
            </button>
            <button 
              (click)="refreshStats()"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              Refresh
            </button>
          </div>
        </div>

        @if (adminStatsService.loadingSignal()) {
          <app-loading-spinner text="Loading dashboard..." />
        } @else if (stats()) {
          <div class="space-y-6">
            
            <!-- Quick Stats -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <!-- Total Users -->
              <div class="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white">
                <div class="flex items-center justify-between mb-4">
                  <div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                    </svg>
                  </div>
                  <span class="text-2xl font-bold">{{ formatNumber(stats()!.users.totalUsers) }}</span>
                </div>
                <h3 class="text-lg font-semibold mb-1">Total Users</h3>
                <p class="text-sm text-blue-100">+{{ stats()!.users.newUsersThisMonth }} this month</p>
              </div>

              <!-- Total Movies -->
              <div class="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 text-white">
                <div class="flex items-center justify-between mb-4">
                  <div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v4H7V5zm8 8v2h1v-2h-1zm-2-2H7v4h6v-4zm2 0h1V9h-1v2zm1-4V5h-1v2h1zM5 5v2H4V5h1zm0 4H4v2h1V9zm-1 4h1v2H4v-2z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <span class="text-2xl font-bold">{{ formatNumber(stats()!.movies.totalMovies) }}</span>
                </div>
                <h3 class="text-lg font-semibold mb-1">Total Movies</h3>
                <p class="text-sm text-purple-100">{{ stats()!.movies.publishedMovies }} published</p>
              </div>

              <!-- Active Subscriptions -->
              <div class="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 text-white">
                <div class="flex items-center justify-between mb-4">
                  <div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <span class="text-2xl font-bold">{{ formatNumber(stats()!.subscriptions.totalActiveSubscriptions) }}</span>
                </div>
                <h3 class="text-lg font-semibold mb-1">Active Subscriptions</h3>
                <p class="text-sm text-green-100">Across all tiers</p>
              </div>

              <!-- Monthly Revenue -->
              <div class="bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-xl p-6 text-white">
                <div class="flex items-center justify-between mb-4">
                  <div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <span class="text-2xl font-bold">\${{ formatNumber(stats()!.revenue.monthlyRecurringRevenue) }}</span>
                </div>
                <h3 class="text-lg font-semibold mb-1">Monthly Revenue</h3>
                <p class="text-sm text-yellow-100">MRR</p>
              </div>
            </div>

            <!-- Charts Row -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              <!-- Subscription Breakdown -->
              <div class="bg-dark-800 rounded-xl p-6 border border-gray-700">
                <h2 class="text-xl font-bold text-white mb-6">Subscription Breakdown</h2>
                
                <div class="space-y-4">
                  <!-- Bronze -->
                  <div>
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-gray-300 flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-orange-500"></div>
                        Bronze
                      </span>
                      <span class="text-white font-semibold">{{ stats()!.subscriptions.bronzeSubscriptions }}</span>
                    </div>
                    <div class="w-full bg-dark-700 rounded-full h-2">
                      <div 
                        class="bg-orange-500 h-2 rounded-full transition-all"
                        [style.width.%]="getPercentage(stats()!.subscriptions.bronzeSubscriptions, stats()!.subscriptions.totalActiveSubscriptions)">
                      </div>
                    </div>
                  </div>

                  <!-- Silver -->
                  <div>
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-gray-300 flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-gray-400"></div>
                        Silver
                      </span>
                      <span class="text-white font-semibold">{{ stats()!.subscriptions.silverSubscriptions }}</span>
                    </div>
                    <div class="w-full bg-dark-700 rounded-full h-2">
                      <div 
                        class="bg-gray-400 h-2 rounded-full transition-all"
                        [style.width.%]="getPercentage(stats()!.subscriptions.silverSubscriptions, stats()!.subscriptions.totalActiveSubscriptions)">
                      </div>
                    </div>
                  </div>

                  <!-- Gold -->
                  <div>
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-gray-300 flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                        Gold
                      </span>
                      <span class="text-white font-semibold">{{ stats()!.subscriptions.goldSubscriptions }}</span>
                    </div>
                    <div class="w-full bg-dark-700 rounded-full h-2">
                      <div 
                        class="bg-yellow-500 h-2 rounded-full transition-all"
                        [style.width.%]="getPercentage(stats()!.subscriptions.goldSubscriptions, stats()!.subscriptions.totalActiveSubscriptions)">
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Engagement Stats -->
              <div class="bg-dark-800 rounded-xl p-6 border border-gray-700">
                <h2 class="text-xl font-bold text-white mb-6">Engagement</h2>
                
                <div class="grid grid-cols-2 gap-4">
                  <div class="bg-dark-700 rounded-lg p-4">
                    <p class="text-sm text-gray-400 mb-1">Total Reviews</p>
                    <p class="text-2xl font-bold text-white">{{ formatNumber(stats()!.engagement.totalReviews) }}</p>
                    <p class="text-xs text-green-400 mt-1">+{{ stats()!.engagement.reviewsThisMonth }} this month</p>
                  </div>

                  <div class="bg-dark-700 rounded-lg p-4">
                    <p class="text-sm text-gray-400 mb-1">Total Comments</p>
                    <p class="text-2xl font-bold text-white">{{ formatNumber(stats()!.engagement.totalComments) }}</p>
                    <p class="text-xs text-green-400 mt-1">+{{ stats()!.engagement.commentsThisMonth }} this month</p>
                  </div>

                  <div class="bg-dark-700 rounded-lg p-4">
                    <p class="text-sm text-gray-400 mb-1">Watch Later</p>
                    <p class="text-2xl font-bold text-white">{{ formatNumber(stats()!.engagement.totalWatchLaterEntries) }}</p>
                  </div>

                  <div class="bg-dark-700 rounded-lg p-4">
                    <p class="text-sm text-gray-400 mb-1">Avg Rating</p>
                    <p class="text-2xl font-bold text-white">{{ stats()!.engagement.averageRating.toFixed(1) }}</p>
                    <div class="flex items-center gap-1 mt-1">
                      @for (star of [1,2,3,4,5]; track star) {
                        <svg 
                          class="w-4 h-4"
                          [class.text-yellow-500]="star <= stats()!.engagement.averageRating"
                          [class.text-gray-600]="star > stats()!.engagement.averageRating"
                          fill="currentColor" 
                          viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Top Movies -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              <!-- Top Rated -->
              <div class="bg-dark-800 rounded-xl p-6 border border-gray-700">
                <h2 class="text-xl font-bold text-white mb-6">Top Rated Movies</h2>
                
                <div class="space-y-3">
                  @for (movie of stats()!.movies.topRatedMovies; track movie.id; let i = $index) {
                    <div class="flex items-center gap-4 p-3 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors cursor-pointer">
                      <div class="flex items-center justify-center w-8 h-8 bg-yellow-500/20 text-yellow-400 font-bold rounded">
                        {{ i + 1 }}
                      </div>
                      <div class="flex-1">
                        <h3 class="font-medium text-white">{{ movie.title }}</h3>
                        <div class="flex items-center gap-2 mt-1">
                          <div class="flex items-center gap-1">
                            <svg class="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                            </svg>
                            <span class="text-sm text-gray-300">{{ movie.rating?.toFixed(1) }}</span>
                          </div>
                          <span class="text-xs text-gray-500">{{ movie.count }} reviews</span>
                        </div>
                      </div>
                    </div>
                  }
                </div>
              </div>

              <!-- Most Watched -->
              <div class="bg-dark-800 rounded-xl p-6 border border-gray-700">
                <h2 class="text-xl font-bold text-white mb-6">Most Watched</h2>
                
                <div class="space-y-3">
                  @for (movie of stats()!.movies.mostWatchedMovies; track movie.id; let i = $index) {
                    <div class="flex items-center gap-4 p-3 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors cursor-pointer">
                      <div class="flex items-center justify-center w-8 h-8 bg-red-500/20 text-red-400 font-bold rounded">
                        {{ i + 1 }}
                      </div>
                      <div class="flex-1">
                        <h3 class="font-medium text-white">{{ movie.title }}</h3>
                        <p class="text-sm text-gray-400 mt-1">{{ movie.count }} saves</p>
                      </div>
                    </div>
                  }
                </div>
              </div>
            </div>

            <!-- Support Stats -->
            <div class="bg-dark-800 rounded-xl p-6 border border-gray-700">
              <h2 class="text-xl font-bold text-white mb-6">Support Overview</h2>
              
              <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div class="bg-dark-700 rounded-lg p-4 text-center">
                  <p class="text-3xl font-bold text-yellow-400">{{ stats()!.support.openChats }}</p>
                  <p class="text-sm text-gray-400 mt-1">Open</p>
                </div>

                <div class="bg-dark-700 rounded-lg p-4 text-center">
                  <p class="text-3xl font-bold text-blue-400">{{ stats()!.support.inProgressChats }}</p>
                  <p class="text-sm text-gray-400 mt-1">In Progress</p>
                </div>

                <div class="bg-dark-700 rounded-lg p-4 text-center">
                  <p class="text-3xl font-bold text-green-400">{{ stats()!.support.resolvedChatsToday }}</p>
                  <p class="text-sm text-gray-400 mt-1">Resolved Today</p>
                </div>

                <div class="bg-dark-700 rounded-lg p-4 text-center">
                  <p class="text-3xl font-bold text-purple-400">{{ stats()!.support.totalChatsThisMonth }}</p>
                  <p class="text-sm text-gray-400 mt-1">This Month</p>
                </div>

                <div class="bg-dark-700 rounded-lg p-4 text-center">
                  <p class="text-3xl font-bold text-red-400">{{ stats()!.support.averageResponseTimeMinutes.toFixed(0) }}m</p>
                  <p class="text-sm text-gray-400 mt-1">Avg Response</p>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  adminStatsService = inject(AdminStatsService);
  router = inject(Router);

  stats = this.adminStatsService.statsSignal;

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.adminStatsService.getDashboardStats().subscribe();
  }

  refreshStats(): void {
    this.loadStats();
  }

  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  getPercentage(value: number, total: number): number {
    if (total === 0) return 0;
    return (value / total) * 100;
  }
}