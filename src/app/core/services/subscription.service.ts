import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { UserSubscription } from '../models/user.model';

export interface SubscriptionPlan {
  id: string;
  name: string;
  tier: number;
  description: string;
  pricePerMonth: number;
  maxStreamQuality: number;
  hasEarlyAccess: boolean;
  isActive: boolean;
}

export interface SubscribeToPlanRequest {
  planId: string;
  paymentMethod: number; // 1=CreditCard, 2=PayPal, 3=Stripe
  cardToken?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private http = inject(HttpClient);

  plansSignal = signal<SubscriptionPlan[]>([]);
  currentSubscriptionSignal = signal<UserSubscription | null>(null);
  loadingSignal = signal(false);

  getPlans(): Observable<ApiResponse<SubscriptionPlan[]>> {
    this.loadingSignal.set(true);

    return this.http.get<ApiResponse<SubscriptionPlan[]>>(
      `${environment.apiUrl}/subscriptions/plans`
    ).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.plansSignal.set(response.data);
        }
        this.loadingSignal.set(false);
      })
    );
  }

  getMySubscription(): Observable<ApiResponse<UserSubscription>> {
    return this.http.get<ApiResponse<UserSubscription>>(
      `${environment.apiUrl}/subscriptions/my-subscription`
    ).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.currentSubscriptionSignal.set(response.data);
        } else {
          this.currentSubscriptionSignal.set(null);
        }
      })
    );
  }

  subscribeToPlan(request: SubscribeToPlanRequest): Observable<ApiResponse<UserSubscription>> {
    return this.http.post<ApiResponse<UserSubscription>>(
      `${environment.apiUrl}/subscriptions/subscribe`,
      request
    );
  }

  upgradeSubscription(newPlanId: string): Observable<ApiResponse<UserSubscription>> {
    return this.http.post<ApiResponse<UserSubscription>>(
      `${environment.apiUrl}/subscriptions/upgrade`,
      { newPlanId }
    );
  }

  cancelSubscription(reason?: string): Observable<ApiResponse<boolean>> {
    return this.http.post<ApiResponse<boolean>>(
      `${environment.apiUrl}/subscriptions/cancel`,
      { reason }
    );
  }
}