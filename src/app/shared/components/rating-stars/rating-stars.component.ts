import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-rating-stars',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="flex items-center gap-1">
      @for (star of stars; track $index) {
        <button
          type="button"
          (click)="onStarClick($index + 1)"
          (mouseenter)="onStarHover($index + 1)"
          (mouseleave)="onStarLeave()"
          [disabled]="readonly()"
          class="focus:outline-none transition-transform hover:scale-110"
          [class.cursor-pointer]="!readonly()"
          [class.cursor-default]="readonly()">
          <svg 
            class="w-6 h-6 transition-colors"
            [class.text-yellow-500]="$index < (hoverRating() || rating())"
            [class.text-gray-600]="$index >= (hoverRating() || rating())"
            fill="currentColor" 
            viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
        </button>
      }
      @if (showCount() && totalReviews() > 0) {
        <span class="ml-2 text-sm text-gray-400">({{ totalReviews() }})</span>
      }
    </div>
  `
})

export class RatingStarsComponent {
  rating = input.required<number>();
  readonly = input<boolean>(true);
  showCount = input<boolean>(false);
  totalReviews = input<number>(0);

  // REQUIRED: hoverRating is an input
  hoverRating = input<number>(0);

  // Outputs
  ratingChange = output<number>();
  hoverRatingChange = output<number>();

  stars = [1, 2, 3, 4, 5];

  onStarClick(rating: number): void {
    if (!this.readonly()) {
      this.ratingChange.emit(rating);
    }
  }

  onStarHover(rating: number): void {
    if (!this.readonly()) {
      this.hoverRatingChange.emit(rating);
    }
  }

  onStarLeave(): void {
    if (!this.readonly()) {
      this.hoverRatingChange.emit(0);
    }
  }
}