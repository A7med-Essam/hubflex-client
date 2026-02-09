import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MovieService } from '../../core/services/movie.service';
import { Movie } from '../../core/models/movie.model';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MovieCardComponent, LoadingSpinnerComponent],
  template: `
    <div class="min-h-screen">
      
      <!-- Hero Section -->
      <section class="relative h-[70vh] overflow-hidden">
        <!-- Background Image with Gradient Overlay -->
        <div class="absolute inset-0">
          @if (featuredMovie()) {
            <img 
              [src]="featuredMovie()!.thumbnailUrl" 
              [alt]="featuredMovie()!.title"
              class="w-full h-full object-cover">
            <div class="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/70 to-transparent"></div>
            <div class="absolute inset-0 bg-gradient-to-r from-dark-900 via-transparent to-transparent"></div>
          } @else {
            <div class="w-full h-full bg-gradient-to-br from-red-900/20 to-dark-900"></div>
          }
        </div>

        <!-- Hero Content -->
        <div class="relative container mx-auto px-4 h-full flex items-end pb-20">
          @if (featuredMovie()) {
            <div class="max-w-2xl space-y-6 animate-fade-in">
              <h1 class="text-5xl md:text-7xl font-bold text-white leading-tight">
                {{ featuredMovie()!.title }}
              </h1>
              <p class="text-lg text-gray-300 line-clamp-3">
                {{ featuredMovie()!.description }}
              </p>
              
              <div class="flex items-center gap-4 text-sm text-gray-300">
                <span class="px-3 py-1 bg-white/10 rounded">{{ featuredMovie()!.releaseYear }}</span>
                <span>{{ featuredMovie()!.durationMinutes }} min</span>
                @if (featuredMovie()!.averageRating) {
                  <div class="flex items-center gap-1">
                    <svg class="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                    <span>{{ featuredMovie()!.averageRating!.toFixed(1) }}</span>
                  </div>
                }
              </div>

              <div class="flex items-center gap-4">
                <button 
                  (click)="playMovie(featuredMovie()!.id)"
                  class="px-8 py-3 bg-white text-red-600 font-semibold rounded-lg hover:bg-gray-200 transition-all transform hover:scale-105 flex items-center gap-2">
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                  </svg>
                  Play Now
                </button>
                <button 
                  (click)="viewDetails(featuredMovie()!.id)"
                  class="px-8 py-3 bg-gray-600/50 text-white font-semibold rounded-lg hover:bg-gray-600/70 transition-all backdrop-blur-sm flex items-center gap-2">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  More Info
                </button>
              </div>
            </div>
          }
        </div>
      </section>

      <!-- Content Sections -->
      <div class="container mx-auto px-4 mt-32 relative z-10 space-y-12 pb-20">
        
        <!-- Trending Now -->
        @if (trendingMovies().length > 0) {
          <section>
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl md:text-3xl font-bold text-white">Trending Now</h2>
              <button 
                (click)="router.navigate(['/movies'])"
                class="text-red-500 hover:text-red-400 text-sm font-medium">
                View All →
              </button>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              @for (movie of trendingMovies(); track movie.id) {
                <app-movie-card [movie]="movie" />
              }
            </div>
          </section>
        }

        <!-- New Releases -->
        @if (newReleases().length > 0) {
          <section>
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl md:text-3xl font-bold text-white">New Releases</h2>
              <button 
                (click)="router.navigate(['/movies'], { queryParams: { sortBy: 'releaseYear' } })"
                class="text-red-500 hover:text-red-400 text-sm font-medium">
                View All →
              </button>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              @for (movie of newReleases(); track movie.id) {
                <app-movie-card [movie]="movie" />
              }
            </div>
          </section>
        }

        <!-- Top Rated -->
        @if (topRatedMovies().length > 0) {
          <section>
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl md:text-3xl font-bold text-white">Top Rated</h2>
              <button 
                (click)="router.navigate(['/movies'], { queryParams: { sortBy: 'rating' } })"
                class="text-red-500 hover:text-red-400 text-sm font-medium">
                View All →
              </button>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              @for (movie of topRatedMovies(); track movie.id) {
                <app-movie-card [movie]="movie" />
              }
            </div>
          </section>
        }

        <!-- Loading State -->
        @if (movieService.loadingSignal()) {
          <app-loading-spinner text="Loading movies..." />
        }
      </div>
    </div>
  `
})
export class HomeComponent implements OnInit {
  movieService = inject(MovieService);
  router = inject(Router);

  featuredMovie = signal<Movie | null>(null);
  trendingMovies = signal<Movie[]>([]);
  newReleases = signal<Movie[]>([]);
  topRatedMovies = signal<Movie[]>([]);

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies(): void {
    // Load trending movies
    this.movieService.getMovies({
      pageNumber: 1,
      pageSize: 10,
      sortBy: 'rating',
      sortDescending: true
    }).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.trendingMovies.set(response.data.items);
          if (response.data.items.length > 0) {
            this.featuredMovie.set(response.data.items[0]);
          }
        }
      }
    });

    // Load new releases
    this.movieService.getMovies({
      pageNumber: 1,
      pageSize: 10,
      sortBy: 'releaseYear',
      sortDescending: true
    }).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.newReleases.set(response.data.items);
        }
      }
    });

    // Load top rated
    this.movieService.getMovies({
      pageNumber: 1,
      pageSize: 10,
      minRating: 4.0,
      sortBy: 'rating',
      sortDescending: true
    }).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.topRatedMovies.set(response.data.items);
        }
      }
    });
  }

  playMovie(movieId: string): void {
    this.router.navigate(['/movies', movieId, 'play']);
  }

  viewDetails(movieId: string): void {
    this.router.navigate(['/movies', movieId]);
  }
}