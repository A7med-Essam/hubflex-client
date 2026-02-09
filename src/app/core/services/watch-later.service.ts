import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../models/api-response.model';

export interface WatchLaterItem {
  id: string;
  movieId: string;
  movieTitle: string;
  thumbnailUrl: string;
  releaseYear: number;
  durationMinutes: number;
  addedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class WatchLaterService {
  private http = inject(HttpClient);

  watchLaterSignal = signal<WatchLaterItem[]>([]);
  loadingSignal = signal(false);

  getWatchLaterList(pageNumber = 1, pageSize = 20): Observable<ApiResponse<PaginatedResponse<WatchLaterItem>>> {
    this.loadingSignal.set(true);

    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<ApiResponse<PaginatedResponse<WatchLaterItem>>>(
      `${environment.apiUrl}/watchlater`,
      { params }
    ).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.watchLaterSignal.set(response.data.items);
        }
        this.loadingSignal.set(false);
      })
    );
  }

  addToWatchLater(movieId: string): Observable<ApiResponse<WatchLaterItem>> {
    return this.http.post<ApiResponse<WatchLaterItem>>(
      `${environment.apiUrl}/watchlater`,
      { movieId }
    );
  }

  removeFromWatchLater(movieId: string): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(
      `${environment.apiUrl}/watchlater/${movieId}`
    );
  }

  isInWatchLater(movieId: string): Observable<ApiResponse<boolean>> {
    return this.http.get<ApiResponse<boolean>>(
      `${environment.apiUrl}/watchlater/check/${movieId}`
    );
  }
}