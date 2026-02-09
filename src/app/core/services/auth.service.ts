import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { 
  User, 
  AuthResponse, 
  LoginRequest, 
  RegisterRequest 
} from '../models/user.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  // Signals
  private userSignal = signal<User | null>(null);
  private tokenSignal = signal<string | null>(null);

  // Computed signals
  user = this.userSignal;
  isAuthenticated = computed(() => this.userSignal() !== null);
  isAdmin = computed(() => this.userSignal()?.roles.includes('Admin') ?? false);
  isSupport = computed(() => this.userSignal()?.roles.includes('Support') || (this.userSignal()?.roles.includes('Admin') ?? false));
  currentSubscriptionTier = computed(() => 
    this.userSignal()?.currentSubscription?.tier
  );

  constructor() {
    this.loadUserFromStorage();
  }

  login(request: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(
      `${environment.apiUrl}/auth/login`,
      request
    ).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.setAuthData(response.data);
        }
      }),
      catchError(this.handleError)
    );
  }

  register(request: RegisterRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(
      `${environment.apiUrl}/auth/register`,
      request
    ).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.setAuthData(response.data);
        }
      }),
      catchError(this.handleError)
    );
  }

  logout(): void {
    this.http.post(`${environment.apiUrl}/auth/logout`, {}).subscribe();
    this.clearAuthData();
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return this.tokenSignal();
  }

  private setAuthData(authResponse: AuthResponse): void {
    this.userSignal.set(authResponse.user);
    this.tokenSignal.set(authResponse.token);

    localStorage.setItem('hubflex_token', authResponse.token);
    localStorage.setItem('hubflex_user', JSON.stringify(authResponse.user));
  }

  private clearAuthData(): void {
    this.userSignal.set(null);
    this.tokenSignal.set(null);

    localStorage.removeItem('hubflex_token');
    localStorage.removeItem('hubflex_user');
  }

  private loadUserFromStorage(): void {
    const token = localStorage.getItem('hubflex_token');
    const userJson = localStorage.getItem('hubflex_user');

    if (token && userJson) {
      try {
        const user = JSON.parse(userJson);
        this.userSignal.set(user);
        this.tokenSignal.set(token);
      } catch {
        this.clearAuthData();
      }
    }
  }

  private handleError(error: any): Observable<never> {
    console.error('Auth error:', error);
    return throwError(() => error);
  }
}