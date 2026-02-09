import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-register',
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
            Create your account
          </h2>
          <p class="mt-2 text-sm text-gray-400">
            Start your streaming journey today
          </p>
        </div>

        <!-- Form -->
        <div class="bg-dark-800 rounded-xl shadow-2xl p-8 border border-gray-700">
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-6">
            
            <!-- First Name & Last Name -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="firstName" class="block text-sm font-medium text-gray-300 mb-2">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  formControlName="firstName"
                  class="w-full px-4 py-3 bg-dark-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
                  placeholder="John">
              </div>
              <div>
                <label for="lastName" class="block text-sm font-medium text-gray-300 mb-2">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  formControlName="lastName"
                  class="w-full px-4 py-3 bg-dark-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
                  placeholder="Doe">
              </div>
            </div>

            <!-- Username -->
            <div>
              <label for="userName" class="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <input
                id="userName"
                type="text"
                formControlName="userName"
                class="w-full px-4 py-3 bg-dark-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
                placeholder="johndoe">
            </div>

            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                formControlName="email"
                class="w-full px-4 py-3 bg-dark-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
                placeholder="john@example.com">
              @if (registerForm.get('email')?.invalid && registerForm.get('email')?.touched) {
                <p class="mt-1 text-sm text-red-500">Please enter a valid email</p>
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
                placeholder="Min. 8 characters">
              @if (registerForm.get('password')?.invalid && registerForm.get('password')?.touched) {
                <p class="mt-1 text-sm text-red-500">Password must be at least 8 characters</p>
              }
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              [disabled]="registerForm.invalid || loading()"
              class="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-lg hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-dark-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]">
              @if (loading()) {
                <span class="flex items-center justify-center gap-2">
                  <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating account...
                </span>
              } @else {
                Create Account
              }
            </button>

            <!-- Terms -->
            <p class="text-xs text-gray-400 text-center">
              By creating an account, you agree to our 
              <a href="#" class="text-red-500 hover:text-red-400">Terms of Service</a> and 
              <a href="#" class="text-red-500 hover:text-red-400">Privacy Policy</a>
            </p>
          </form>

          <!-- Divider -->
          <div class="mt-6">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-700"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-dark-800 text-gray-400">Already have an account?</span>
              </div>
            </div>
          </div>

          <!-- Login Link -->
          <div class="mt-6 text-center">
            <a 
              routerLink="/auth/login"
              class="text-red-500 hover:text-red-400 font-medium">
              Sign in instead
            </a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  loading = signal(false);

  registerForm: FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    userName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.loading.set(true);

    this.authService.register(this.registerForm.value).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastService.success('Account created successfully!');
          this.router.navigate(['/home']);
        }
      },
      error: (error) => {
        this.loading.set(false);
        this.toastService.error(error.error?.message || 'Registration failed. Please try again.');
      },
      complete: () => {
        this.loading.set(false);
      }
    });
  }
}