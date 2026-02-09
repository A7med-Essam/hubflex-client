import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';

export interface DashboardStats {
  users: UserStatistics;
  movies: MovieStatistics;
  subscriptions: SubscriptionStatistics;
  engagement: EngagementStatistics;
  support: SupportStatistics;
  revenue: RevenueStatistics;
}

export interface UserStatistics {
  totalUsers: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
  activeUsersToday: number;
  newsletterSubscribers: number;
}

export interface MovieStatistics {
  totalMovies: number;
  publishedMovies: number;
  draftMovies: number;
  totalGenres: number;
  totalTopics: number;
  mostWatchedMovies: TopMovie[];
  topRatedMovies: TopMovie[];
}

export interface TopMovie {
  id: string;
  title: string;
  rating?: number;
  count: number;
}

export interface SubscriptionStatistics {
  totalActiveSubscriptions: number;
  bronzeSubscriptions: number;
  silverSubscriptions: number;
  goldSubscriptions: number;
  monthlyTrends: SubscriptionTrend[];
}

export interface SubscriptionTrend {
  month: string;
  bronze: number;
  silver: number;
  gold: number;
  total: number;
}

export interface EngagementStatistics {
  totalReviews: number;
  reviewsThisMonth: number;
  totalComments: number;
  commentsThisMonth: number;
  totalWatchLaterEntries: number;
  averageRating: number;
}

export interface SupportStatistics {
  openChats: number;
  inProgressChats: number;
  resolvedChatsToday: number;
  totalChatsThisMonth: number;
  averageResponseTimeMinutes: number;
}

export interface RevenueStatistics {
  monthlyRecurringRevenue: number;
  projectedAnnualRevenue: number;
  averageRevenuePerUser: number;
  monthlyRevenue: MonthlyRevenue[];
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminStatsService {
  private http = inject(HttpClient);

  statsSignal = signal<DashboardStats | null>(null);
  loadingSignal = signal(false);

  getDashboardStats(): Observable<ApiResponse<DashboardStats>> {
    this.loadingSignal.set(true);

    return this.http.get<ApiResponse<DashboardStats>>(
      `${environment.apiUrl}/admin/dashboard/stats`
    ).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.statsSignal.set(response.data);
        }
        this.loadingSignal.set(false);
      })
    );
  }

  getUserStatistics(): Observable<ApiResponse<UserStatistics>> {
    return this.http.get<ApiResponse<UserStatistics>>(
      `${environment.apiUrl}/admin/dashboard/stats/users`
    );
  }

  getMovieStatistics(): Observable<ApiResponse<MovieStatistics>> {
    return this.http.get<ApiResponse<MovieStatistics>>(
      `${environment.apiUrl}/admin/dashboard/stats/movies`
    );
  }

  getSubscriptionStatistics(): Observable<ApiResponse<SubscriptionStatistics>> {
    return this.http.get<ApiResponse<SubscriptionStatistics>>(
      `${environment.apiUrl}/admin/dashboard/stats/subscriptions`
    );
  }

  getEngagementStatistics(): Observable<ApiResponse<EngagementStatistics>> {
    return this.http.get<ApiResponse<EngagementStatistics>>(
      `${environment.apiUrl}/admin/dashboard/stats/engagement`
    );
  }

  getSupportStatistics(): Observable<ApiResponse<SupportStatistics>> {
    return this.http.get<ApiResponse<SupportStatistics>>(
      `${environment.apiUrl}/admin/dashboard/stats/support`
    );
  }

  getRevenueStatistics(): Observable<ApiResponse<RevenueStatistics>> {
    return this.http.get<ApiResponse<RevenueStatistics>>(
      `${environment.apiUrl}/admin/dashboard/stats/revenue`
    );
  }
}