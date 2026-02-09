import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReviewService } from '../../../core/services/review.service';
import { Review } from '../../../core/models/movie.model';
import { ToastService } from '../../../core/services/toast.service';
import { RatingStarsComponent } from '../../../shared/components/rating-stars/rating-stars.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';



@Component({
  selector: 'app-my-reviews',
  standalone: true,
  imports: [CommonModule, RatingStarsComponent, LoadingSpinnerComponent],
  template: `
    <div class="min-h-screen">
      <div class="container mx-auto px-4 py-8">
        
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-4xl font-bold text-white mb-2">My Reviews</h1>
          <p class="text-gray-400">Reviews you've written</p>
        </div>

        <!-- Content -->
        @if (loading()) {
          <app-loading-spinner text="Loading reviews..." />
        } @else if (reviews().length === 0) {
          <div class="text-center py-20">
            <svg class="w-32 h-32 mx-auto text-gray-600 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
            </svg>
            <h3 class="text-2xl font-semibold text-white mb-3">No reviews yet</h3>
            <p class="text-gray-400 mb-6">Share your thoughts about movies you've watched</p>
            <button 
              (click)="router.navigate(['/movies'])"
              class="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors">
              Browse Movies
            </button>
          </div>
        } @else {
          <div class="space-y-4">
            @for (review of reviews(); track review.id) {
              <div class="bg-dark-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors">
                <div class="flex items-start justify-between mb-4">
                  <div class="flex-1">
                    <h3 
                      (click)="viewMovie(review.movieId)"
                      class="text-xl font-semibold text-white hover:text-red-500 cursor-pointer transition-colors mb-2">
                      Movie Review
                    </h3>
                    <app-rating-stars [rating]="review.rating" [readonly]="true" />
                  </div>
                  
                  <div class="flex items-center gap-2">
                    <button 
                      (click)="editReview(review)"
                      class="p-2 text-gray-400 hover:text-white transition-colors">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                      </svg>
                    </button>
                    <button 
                      (click)="deleteReview(review.id)"
                      class="p-2 text-red-400 hover:text-red-300 transition-colors">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                    </button>
                  </div>
                </div>

                @if (review.title) {
                  <h4 class="font-semibold text-white mb-2">{{ review.title }}</h4>
                }
                
                <p class="text-gray-300 mb-3">{{ review.content }}</p>
                
                <div class="flex items-center justify-between text-sm text-gray-500">
                  <span>{{ formatDate(review.createdAt) }}</span>
                  @if (review.isEdited) {
                    <span>(Edited)</span>
                  }
                </div>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `
})
export class MyReviewsComponent implements OnInit {
  private reviewService = inject(ReviewService);
  router = inject(Router);
  private toastService = inject(ToastService);

  reviews = signal<Review[]>([]);
  loading = signal(false);

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.loading.set(true);
    this.reviewService.getMyReviews().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.reviews.set(response.data.items);
        }
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.toastService.error('Failed to load reviews');
      }
    });
  }


  viewMovie(movieId: string): void {
    this.router.navigate(['/movies', movieId]);
  }

  editReview(review: Review): void {
    this.toastService.info('Edit functionality coming soon!');
  }

  deleteReview(reviewId: string): void {
    if (confirm('Are you sure you want to delete this review?')) {
      this.reviewService.deleteReview(reviewId).subscribe({
        next: (response) => {
          if (response.success) {
            this.toastService.success('Review deleted successfully');
            // Reload reviews
          }
        },
        error: () => {
          this.toastService.error('Failed to delete review');
        }
      });
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}