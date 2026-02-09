import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../../../core/services/movie.service';
import { Movie, MovieFilter } from '../../../core/models/movie.model';
import { MovieCardComponent } from '../../../shared/components/movie-card/movie-card.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MovieCardComponent, LoadingSpinnerComponent],
  template: `
    <div class="min-h-screen">
      <div class="container mx-auto px-4 py-8">
        
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-4xl font-bold text-white mb-2">Browse Movies</h1>
          <p class="text-gray-400">Discover your next favorite film</p>
        </div>

        <!-- Filters -->
        <div class="bg-dark-800 rounded-lg p-6 mb-8 border border-gray-700">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            <!-- Search -->
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-300 mb-2">Search</label>
              <input
                type="text"
                [(ngModel)]="searchTerm"
                (ngModelChange)="onFilterChange()"
                placeholder="Search movies..."
                class="w-full px-4 py-2 bg-dark-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600">
            </div>

            <!-- Sort By -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
              <select
                [(ngModel)]="sortBy"
                (ngModelChange)="onFilterChange()"
                class="w-full px-4 py-2 bg-dark-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600">
                <option value="title">Title</option>
                <option value="releaseYear">Release Year</option>
                <option value="rating">Rating</option>
              </select>
            </div>

            <!-- Sort Order -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Order</label>
              <select
                [(ngModel)]="sortDescending"
                (ngModelChange)="onFilterChange()"
                class="w-full px-4 py-2 bg-dark-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600">
                <option [value]="true">Descending</option>
                <option [value]="false">Ascending</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Results Info -->
        @if (!movieService.loadingSignal() && totalCount() > 0) {
          <div class="mb-6 text-gray-400">
            Showing {{ movies().length }} of {{ totalCount() }} movies
          </div>
        }

        <!-- Movies Grid -->
        @if (movieService.loadingSignal()) {
          <app-loading-spinner text="Loading movies..." />
        } @else if (movies().length === 0) {
          <div class="text-center py-20">
            <svg class="w-24 h-24 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"/>
            </svg>
            <h3 class="text-xl font-semibold text-white mb-2">No movies found</h3>
            <p class="text-gray-400">Try adjusting your search or filters</p>
          </div>
        } @else {
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
            @for (movie of movies(); track movie.id) {
              <app-movie-card [movie]="movie" />
            }
          </div>

          <!-- Pagination -->
          @if (totalPages() > 1) {
            <div class="flex justify-center items-center gap-2">
              <button
                (click)="previousPage()"
                [disabled]="currentPage() === 1"
                class="px-4 py-2 bg-dark-700 text-white rounded-lg hover:bg-dark-600 disabled:opacity-50 disabled:cursor-not-allowed">
                Previous
              </button>

              <div class="flex items-center gap-2">
                @for (page of visiblePages(); track page) {
                  <button
                    (click)="goToPage(page)"
                    [class.bg-red-600]="page === currentPage()"
                    [class.bg-dark-700]="page !== currentPage()"
                    class="w-10 h-10 rounded-lg text-white hover:bg-red-700 transition-colors">
                    {{ page }}
                  </button>
                }
              </div>

              <button
                (click)="nextPage()"
                [disabled]="currentPage() === totalPages()"
                class="px-4 py-2 bg-dark-700 text-white rounded-lg hover:bg-dark-600 disabled:opacity-50 disabled:cursor-not-allowed">
                Next
              </button>
            </div>
          }
        }
      </div>
    </div>
  `
})
export class MovieListComponent implements OnInit {
  movieService = inject(MovieService);
  private route = inject(ActivatedRoute);

  movies = signal<Movie[]>([]);
  searchTerm = '';
  sortBy = 'title';
  sortDescending = true;
  currentPage = signal(1);
  pageSize = 20;
  totalCount = signal(0);
  totalPages = signal(0);

  visiblePages = signal<number[]>([]);

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['sortBy']) {
        this.sortBy = params['sortBy'];
      }
      this.loadMovies();
    });
  }

  loadMovies(): void {
    const filter: MovieFilter = {
      searchTerm: this.searchTerm || undefined,
      sortBy: this.sortBy,
      sortDescending: this.sortDescending,
      pageNumber: this.currentPage(),
      pageSize: this.pageSize
    };

    this.movieService.getMovies(filter).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.movies.set(response.data.items);
          this.totalCount.set(response.data.totalCount);
          this.totalPages.set(response.data.totalPages);
          this.updateVisiblePages();
        }
      }
    });
  }

  onFilterChange(): void {
    this.currentPage.set(1);
    this.loadMovies();
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
      this.loadMovies();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
      this.loadMovies();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  goToPage(page: number): void {
    this.currentPage.set(page);
    this.loadMovies();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private updateVisiblePages(): void {
    const pages: number[] = [];
    const current = this.currentPage();
    const total = this.totalPages();
    const maxVisible = 5;

    let start = Math.max(1, current - Math.floor(maxVisible / 2));
    let end = Math.min(total, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    this.visiblePages.set(pages);
  }
}