import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Movie, MovieFilter } from '../models/movie.model';
import { ApiResponse, PaginatedResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private http = inject(HttpClient);

  // Signals for caching
  moviesSignal = signal<Movie[]>([]);
  selectedMovieSignal = signal<Movie | null>(null);
  loadingSignal = signal<boolean>(false);

  getMovies(filter: MovieFilter): Observable<ApiResponse<PaginatedResponse<Movie>>> {
    this.loadingSignal.set(true);

    let params = new HttpParams()
      .set('pageNumber', filter.pageNumber.toString())
      .set('pageSize', filter.pageSize.toString());

    if (filter.searchTerm) {
      params = params.set('searchTerm', filter.searchTerm);
    }

    if (filter.sortBy) {
      params = params.set('sortBy', filter.sortBy);
      params = params.set('sortDescending', filter.sortDescending?.toString() ?? 'true');
    }

    return this.http.get<ApiResponse<PaginatedResponse<Movie>>>(
      `${environment.apiUrl}/movies`,
      { params }
    ).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.moviesSignal.set(response.data.items);
        }
        this.loadingSignal.set(false);
      })
    );
  }

  getMovieById(id: string): Observable<ApiResponse<Movie>> {
    this.loadingSignal.set(true);

    return this.http.get<ApiResponse<Movie>>(
      `${environment.apiUrl}/movies/${id}`
    ).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.selectedMovieSignal.set(response.data);
        }
        this.loadingSignal.set(false);
      })
    );
  }

  getStreamUrl(movieId: string): Observable<ApiResponse<string>> {
    return this.http.get<ApiResponse<string>>(
      `${environment.apiUrl}/movies/${movieId}/stream`
    );
  }
}