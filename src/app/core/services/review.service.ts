import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Review, Comment } from '../models/movie.model';
import { ApiResponse, PaginatedResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private http = inject(HttpClient);

  getMovieReviews(movieId: string, pageNumber = 1, pageSize = 10): Observable<ApiResponse<PaginatedResponse<Review>>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<ApiResponse<PaginatedResponse<Review>>>(
      `${environment.apiUrl}/reviews/movie/${movieId}`,
      { params }
    );
  }

  createReview(review: { movieId: string; rating: number; title?: string; content: string }): Observable<ApiResponse<Review>> {
    return this.http.post<ApiResponse<Review>>(
      `${environment.apiUrl}/reviews`,
      review
    );
  }

  updateReview(reviewId: string, update: { rating?: number; title?: string; content?: string }): Observable<ApiResponse<Review>> {
    return this.http.put<ApiResponse<Review>>(
      `${environment.apiUrl}/reviews/${reviewId}`,
      update
    );
  }

  deleteReview(reviewId: string): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(
      `${environment.apiUrl}/reviews/${reviewId}`
    );
  }

  getMovieComments(movieId: string, pageNumber = 1, pageSize = 10): Observable<ApiResponse<PaginatedResponse<Comment>>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<ApiResponse<PaginatedResponse<Comment>>>(
      `${environment.apiUrl}/comments/movie/${movieId}`,
      { params }
    );
  }

  createComment(comment: { movieId: string; parentCommentId?: string; content: string }): Observable<ApiResponse<Comment>> {
    return this.http.post<ApiResponse<Comment>>(
      `${environment.apiUrl}/comments`,
      comment
    );
  }
}