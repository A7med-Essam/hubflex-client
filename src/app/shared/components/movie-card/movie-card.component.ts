import { Component, input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Movie } from '../../../core/models/movie.model';
import { RatingStarsComponent } from '../rating-stars/rating-stars.component';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule, RatingStarsComponent],
  template: `
    <div 
      (click)="navigateToMovie()"
      class="group relative cursor-pointer overflow-hidden rounded-lg bg-dark-700 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-red-600/20">
      
      <!-- Thumbnail -->
      <div class="aspect-[2/3] overflow-hidden">
        <img 
          [src]="movie().thumbnailUrl" 
          [alt]="movie().title"
          class="h-full w-full object-cover transition-transform group-hover:scale-110"
          loading="lazy">
        
        <!-- Overlay on hover -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div class="absolute bottom-0 left-0 right-0 p-4 space-y-2">
            <div class="flex items-center gap-2 text-xs text-gray-300">
              <span>{{ movie().releaseYear }}</span>
              <span>•</span>
              <span>{{ movie().durationMinutes }} min</span>
            </div>
            
            @if (movie().averageRating) {
              <app-rating-stars 
                [rating]="movie().averageRating!"
                [readonly]="true"
                [showCount]="true"
                [totalReviews]="movie().totalReviews" />
            }

            <!-- Genres -->
            <div class="flex flex-wrap gap-1">
              @for (genre of movie().genres.slice(0, 3); track genre) {
                <span class="px-2 py-1 text-xs bg-white/10 rounded">
                  {{ genre }}
                </span>
              }
            </div>
          </div>
        </div>
      </div>

      <!-- Title (always visible) -->
      <div class="p-3">
        <h3 class="font-semibold text-white line-clamp-1 group-hover:text-red-500 transition-colors">
          {{ movie().title }}
        </h3>
        
        <!-- Subscription Badge -->
        <div class="mt-2 flex items-center gap-2">
          <span 
            class="px-2 py-1 text-xs font-medium rounded"
            [ngClass]="{
              'bg-orange-500/20 text-orange-400': movie().requiredSubscriptionTier === 1,
              'bg-gray-400/20 text-gray-300': movie().requiredSubscriptionTier === 2,
              'bg-yellow-500/20 text-yellow-400': movie().requiredSubscriptionTier === 3
            }">
            {{ getTierName(movie().requiredSubscriptionTier) }}
          </span>
        </div>
      </div>
    </div>
  `
})
export class MovieCardComponent {
  movie = input.required<Movie>();
  private router = inject(Router);

  navigateToMovie(): void {
    this.router.navigate(['/movies', this.movie().id]);
  }

  getTierName(tier: number): string {
    return ['', 'Bronze', 'Silver', 'Gold'][tier] || '';
  }
}