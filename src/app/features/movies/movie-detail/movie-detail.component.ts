import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MovieService } from '../../../core/services/movie.service';
import { ReviewService } from '../../../core/services/review.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { Movie, Review, Comment } from '../../../core/models/movie.model';
import { RatingStarsComponent } from '../../../shared/components/rating-stars/rating-stars.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RatingStarsComponent, LoadingSpinnerComponent],
  template: `
    @if (loading()) {
      <app-loading-spinner text="Loading movie details..." />
    } @else if (movie()) {
      <div class="min-h-screen">
        
        <!-- Hero Section -->
        <section class="relative h-[60vh] overflow-hidden">
          <div class="absolute inset-0">
            <img 
              [src]="movie()!.thumbnailUrl" 
              [alt]="movie()!.title"
              class="w-full h-full object-cover">
            <div class="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/80 to-dark-900/40"></div>
          </div>

          <div class="relative container mx-auto px-4 h-full flex items-end pb-12">
            <div class="max-w-3xl">
              <h1 class="text-5xl md:text-6xl font-bold text-white mb-4">
                {{ movie()!.title }}
              </h1>
              
              <div class="flex items-center gap-4 text-gray-300 mb-6">
                <span class="px-3 py-1 bg-white/10 rounded">{{ movie()!.releaseYear }}</span>
                <span>{{ movie()!.durationMinutes }} min</span>
                @if (movie()!.averageRating) {
                  <app-rating-stars 
                    [rating]="movie()!.averageRating!" 
                    [readonly]="true"
                    [showCount]="true"
                    [totalReviews]="movie()!.totalReviews" />
                }
              </div>

              <div class="flex items-center gap-4">
                <button 
                  (click)="playMovie()"
                  class="px-8 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all transform hover:scale-105 flex items-center gap-2">
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                  </svg>
                  Play Now
                </button>
                <button 
                  (click)="addToWatchLater()"
                  class="px-6 py-3 bg-gray-600/50 text-white font-semibold rounded-lg hover:bg-gray-600/70 transition-all backdrop-blur-sm flex items-center gap-2">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                  </svg>
                  My List
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- Movie Info -->
        <div class="container mx-auto px-4 py-12">
          
          <!-- Description & Details -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div class="lg:col-span-2">
              <h2 class="text-2xl font-bold text-white mb-4">Overview</h2>
              <p class="text-gray-300 leading-relaxed">{{ movie()!.description }}</p>
            </div>

            <div class="bg-dark-800 rounded-lg p-6 border border-gray-700 h-fit">
              <h3 class="text-lg font-semibold text-white mb-4">Details</h3>
              
              <div class="space-y-3">
                <div>
                  <span class="text-gray-400 text-sm">Genres</span>
                  <div class="flex flex-wrap gap-2 mt-1">
                    @for (genre of movie()!.genres; track genre) {
                      <span class="px-3 py-1 bg-dark-700 text-white text-sm rounded-full">
                        {{ genre }}
                      </span>
                    }
                  </div>
                </div>

                @if (movie()!.topics.length > 0) {
                  <div>
                    <span class="text-gray-400 text-sm">Collections</span>
                    <div class="flex flex-wrap gap-2 mt-1">
                      @for (topic of movie()!.topics; track topic) {
                        <span class="px-3 py-1 bg-dark-700 text-white text-sm rounded-full">
                          {{ topic }}
                        </span>
                      }
                    </div>
                  </div>
                }

                <div>
                  <span class="text-gray-400 text-sm">Required Plan</span>
                  <div class="mt-1">
                    <span 
                      class="px-3 py-1 rounded-full text-sm font-medium"
                      [ngClass]="{
                        'bg-orange-500/20 text-orange-400': movie()!.requiredSubscriptionTier === 1,
                        'bg-gray-400/20 text-gray-300': movie()!.requiredSubscriptionTier === 2,
                        'bg-yellow-500/20 text-yellow-400': movie()!.requiredSubscriptionTier === 3
                      }">
                      {{ getTierName(movie()!.requiredSubscriptionTier) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Reviews Section -->
          <div class="mb-12">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-bold text-white">Reviews</h2>
              @if (authService.isAuthenticated()) {
                <button 
                  (click)="showReviewForm.set(!showReviewForm())"
                  class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  {{ showReviewForm() ? 'Cancel' : 'Write a Review' }}
                </button>
              }
            </div>

            <!-- Review Form -->
            @if (showReviewForm()) {
              <div class="bg-dark-800 rounded-lg p-6 border border-gray-700 mb-6 animate-slide-up">
                <h3 class="text-lg font-semibold text-white mb-4">Share Your Thoughts</h3>
                
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Your Rating</label>
                    <app-rating-stars 
                      [rating]="newReviewRating()"
                      [readonly]="false"
                      (ratingChange)="newReviewRating.set($event)" />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Title (Optional)</label>
                    <input
                      type="text"
                      [(ngModel)]="newReviewTitle"
                      placeholder="Give your review a title"
                      class="w-full px-4 py-2 bg-dark-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600">
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Review</label>
                    <textarea
                      [(ngModel)]="newReviewContent"
                      rows="4"
                      placeholder="What did you think about this movie?"
                      class="w-full px-4 py-2 bg-dark-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 resize-none"></textarea>
                  </div>

                  <button
                    (click)="submitReview()"
                    [disabled]="newReviewRating() === 0 || !newReviewContent.trim()"
                    class="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    Submit Review
                  </button>
                </div>
              </div>
            }

            <!-- Reviews List -->
            @if (loadingReviews()) {
              <app-loading-spinner text="Loading reviews..." containerClass="py-8" />
            } @else if (reviews().length === 0) {
              <div class="text-center py-12 bg-dark-800 rounded-lg border border-gray-700">
                <p class="text-gray-400">No reviews yet. Be the first to review!</p>
              </div>
            } @else {
              <div class="space-y-4">
                @for (review of reviews(); track review.id) {
                  <div class="bg-dark-800 rounded-lg p-6 border border-gray-700">
                    <div class="flex items-start justify-between mb-3">
                      <div>
                        <div class="flex items-center gap-3 mb-2">
                          <div class="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                            <span class="text-white font-semibold">{{ review.userName.charAt(0).toUpperCase() }}</span>
                          </div>
                          <div>
                            <p class="font-medium text-white">{{ review.userName }}</p>
                            <p class="text-sm text-gray-400">{{ formatDate(review.createdAt) }}</p>
                          </div>
                        </div>
                        <app-rating-stars [rating]="review.rating" [readonly]="true" />
                      </div>
                    </div>

                    @if (review.title) {
                      <h4 class="font-semibold text-white mb-2">{{ review.title }}</h4>
                    }
                    <p class="text-gray-300">{{ review.content }}</p>
                    
                    @if (review.isEdited) {
                      <p class="text-xs text-gray-500 mt-2">(Edited)</p>
                    }
                  </div>
                }
              </div>
            }
          </div>
        </div>
      </div>
    }
  `
})
export class MovieDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  movieService = inject(MovieService);
  private reviewService = inject(ReviewService);
  authService = inject(AuthService);
  private toastService = inject(ToastService);

  movie = signal<Movie | null>(null);
  loading = signal(true);
  reviews = signal<Review[]>([]);
  loadingReviews = signal(false);

  showReviewForm = signal(false);
  newReviewRating = signal(0);
  newReviewTitle = '';
  newReviewContent = '';

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const movieId = params['id'];
      if (movieId) {
        this.loadMovie(movieId);
        this.loadReviews(movieId);
      }
    });
  }

  loadMovie(id: string): void {
    this.loading.set(true);
    this.movieService.getMovieById(id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.movie.set(response.data);
        }
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.toastService.error('Failed to load movie');
      }
    });
  }

  loadReviews(movieId: string): void {
    this.loadingReviews.set(true);
    this.reviewService.getMovieReviews(movieId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.reviews.set(response.data.items);
        }
        this.loadingReviews.set(false);
      },
      error: () => {
        this.loadingReviews.set(false);
      }
    });
  }

  playMovie(): void {
    if (this.movie()) {
      this.router.navigate(['/movies', this.movie()!.id, 'play']);
    }
  }

  addToWatchLater(): void {
    this.toastService.info('Watch Later feature coming soon!');
  }

  submitReview(): void {
  if (!this.movie() || this.newReviewRating() === 0 || !this.newReviewContent.trim()) {
    this.toastService.error('Please provide a rating and review content');
    return;
  }

  const review = {
    movieId: this.movie()!.id,
    rating: this.newReviewRating(),
    title: this.newReviewTitle || undefined,
    content: this.newReviewContent
  };

  this.reviewService.createReview(review).subscribe({
    next: (response) => {
      if (response.success) {
        this.toastService.success('Review submitted successfully!');
        this.loadReviews(this.movie()!.id);
        this.loadMovie(this.movie()!.id);
        this.showReviewForm.set(false);
        this.resetReviewForm();
      }
    },
    error: (error) => {
      console.error('Review error:', error);
      
      // Display backend error message
      let errorMessage = 'Failed to submit review';
      
      if (error.error?.message) {
        errorMessage = error.error.message;
      } else if (error.error?.errors && error.error.errors?.Content.length > 0) {
        errorMessage = error.error.errors.Content.join(', ');
      }
      
      this.toastService.error(errorMessage);
    }
  });
}

  resetReviewForm(): void {
    this.newReviewRating.set(0);
    this.newReviewTitle = '';
    this.newReviewContent = '';
  }

  getTierName(tier: number): string {
    return ['', 'Bronze', 'Silver', 'Gold'][tier] || '';
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}