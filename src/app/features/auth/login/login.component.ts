import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LoadingSpinnerComponent],
  template: `
    <div class="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      <div class="max-w-md w-full space-y-8 animate-fade-in">
        
        <!-- Logo -->
        <div class="text-center">
          <div class="flex items-center justify-center gap-2 mb-2">
            <div class="w-12 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-2xl">H</span>
            </div>
            <span class="text-3xl font-bold text-white">HubFlex</span>
          </div>
          <h2 class="mt-6 text-3xl font-bold text-white">
            Welcome back
          </h2>
          <p class="mt-2 text-sm text-gray-400">
            Sign in to continue watching
          </p>
        </div>

        <!-- Form -->
        <div class="bg-dark-800 rounded-xl shadow-2xl p-8 border border-gray-700">
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
            
            <!-- Email/Username -->
            <div>
              <label for="emailOrUsername" class="block text-sm font-medium text-gray-300 mb-2">
                Email or Username
              </label>
              <input
                id="emailOrUsername"
                type="text"
                formControlName="emailOrUsername"
                class="w-full px-4 py-3 bg-dark-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
                placeholder="Enter your email or username">
              @if (loginForm.get('emailOrUsername')?.invalid && loginForm.get('emailOrUsername')?.touched) {
                <p class="mt-1 text-sm text-red-500">Email or username is required</p>
              }
            </div>

            <!-- Password -->
            <div>
              <label for="password" class="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                formControlName="password"
                class="w-full px-4 py-3 bg-dark-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
                placeholder="Enter your password">
              @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
                <p class="mt-1 text-sm text-red-500">Password is required</p>
              }
            </div>

            <!-- Remember Me & Forgot Password -->
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <input
                  id="rememberMe"
                  type="checkbox"
                  formControlName="rememberMe"
                  class="h-4 w-4 text-red-600 focus:ring-red-600 border-gray-600 rounded bg-dark-700">
                <label for="rememberMe" class="ml-2 block text-sm text-gray-300">
                  Remember me
                </label>
              </div>
              <a href="#" class="text-sm text-red-500 hover:text-red-400">
                Forgot password?
              </a>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              [disabled]="loginForm.invalid || loading()"
              class="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-lg hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-dark-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]">
              @if (loading()) {
                <span class="flex items-center justify-center gap-2">
                  <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </span>
              } @else {
                Sign in
              }
            </button>
          </form>

          <!-- Divider -->
          <div class="mt-6">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-700"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-dark-800 text-gray-400">Don't have an account?</span>
              </div>
            </div>
          </div>

          <!-- Register Link -->
          <div class="mt-6 text-center">
            <a 
              routerLink="/auth/register"
              class="text-red-500 hover:text-red-400 font-medium">
              Create an account
            </a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  loading = signal(false);

  loginForm: FormGroup = this.fb.group({
    emailOrUsername: ['', Validators.required],
    password: ['', Validators.required],
    rememberMe: [false]
  });

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.loading.set(true);

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastService.success('Welcome back!');
          this.router.navigate(['/home']);
        }
      },
      error: (error) => {
        this.loading.set(false);
        this.toastService.error(error.error?.message || 'Login failed. Please check your credentials.');
      },
      complete: () => {
        this.loading.set(false);
      }
    });
  }
}