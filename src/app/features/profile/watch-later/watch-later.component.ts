import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { WatchLaterService, WatchLaterItem } from '../../../core/services/watch-later.service';
import { ToastService } from '../../../core/services/toast.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-watch-later',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  template: `
    <div class="min-h-screen">
      <div class="container mx-auto px-4 py-8">
        
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-4xl font-bold text-white mb-2">My List</h1>
          <p class="text-gray-400">Movies you want to watch later</p>
        </div>

        <!-- Content -->
        @if (watchLaterService.loadingSignal()) {
          <app-loading-spinner text="Loading your list..." />
        } @else if (watchLaterService.watchLaterSignal().length === 0) {
          <div class="text-center py-20">
            <svg class="w-32 h-32 mx-auto text-gray-600 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
            </svg>
            <h3 class="text-2xl font-semibold text-white mb-3">Your list is empty</h3>
            <p class="text-gray-400 mb-6">Add movies you want to watch later</p>
            <button 
              (click)="router.navigate(['/movies'])"
              class="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors">
              Browse Movies
            </button>
          </div>
        } @else {
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            @for (item of watchLaterService.watchLaterSignal(); track item.id) {
              <div class="group relative overflow-hidden rounded-lg bg-dark-700 hover:scale-105 transition-transform">
                
                <!-- Thumbnail -->
                <div class="aspect-[2/3] overflow-hidden">
                  <img 
                    [src]="item.thumbnailUrl" 
                    [alt]="item.movieTitle"
                    class="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    loading="lazy">
                  
                  <!-- Overlay -->
                  <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div class="absolute bottom-0 left-0 right-0 p-4 space-y-3">
                      
                      <!-- Buttons -->
                      <div class="flex items-center gap-2">
                        <button 
                          (click)="playMovie(item.movieId)"
                          class="flex-1 py-2 bg-white text-dark-900 font-medium rounded hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 text-sm">
                          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                          </svg>
                          Play
                        </button>
                        <button 
                          (click)="removeFromList(item.movieId)"
                          class="p-2 bg-red-600/80 text-white rounded hover:bg-red-600 transition-colors">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Info -->
                <div class="p-3">
                  <h3 
                    (click)="viewDetails(item.movieId)"
                    class="font-semibold text-white line-clamp-1 cursor-pointer hover:text-red-500 transition-colors">
                    {{ item.movieTitle }}
                  </h3>
                  <div class="mt-2 flex items-center gap-2 text-xs text-gray-400">
                    <span>{{ item.releaseYear }}</span>
                    <span>•</span>
                    <span>{{ item.durationMinutes }} min</span>
                  </div>
                  <p class="mt-2 text-xs text-gray-500">
                    Added {{ formatDate(item.addedAt) }}
                  </p>
                </div>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `
})
export class WatchLaterComponent implements OnInit {
  watchLaterService = inject(WatchLaterService);
  router = inject(Router);
  private toastService = inject(ToastService);

  ngOnInit(): void {
    this.loadWatchLater();
  }

  loadWatchLater(): void {
    this.watchLaterService.getWatchLaterList().subscribe({
      error: () => {
        this.toastService.error('Failed to load your list');
      }
    });
  }

  removeFromList(movieId: string): void {
    this.watchLaterService.removeFromWatchLater(movieId).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastService.success('Removed from your list');
          this.loadWatchLater();
        }
      },
      error: () => {
        this.toastService.error('Failed to remove from list');
      }
    });
  }

  playMovie(movieId: string): void {
    this.router.navigate(['/movies', movieId, 'play']);
  }

  viewDetails(movieId: string): void {
    this.router.navigate(['/movies', movieId]);
  }

  formatDate(date: string): string {
    const now = new Date();
    const addedDate = new Date(date);
    const diffTime = Math.abs(now.getTime() - addedDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'today';
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  }
}