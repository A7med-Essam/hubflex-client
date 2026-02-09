import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { SubscriptionService, SubscriptionPlan } from '../../../core/services/subscription.service';
import { ToastService } from '../../../core/services/toast.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent, ConfirmationDialogComponent],
  template: `
    <div class="min-h-screen bg-dark-900">
      <div class="container mx-auto px-4 py-8">
        
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-4xl font-bold text-white mb-2">Subscription</h1>
          <p class="text-gray-400">Manage your subscription plan</p>
        </div>

        <!-- Current Plan -->
        @if (subscriptionService.currentSubscriptionSignal()) {
          <div class="bg-gradient-to-br from-dark-800 to-dark-900 rounded-xl p-8 border-2 border-yellow-500/30 mb-8 animate-fade-in">
            <div class="flex items-center justify-between mb-6">
              <div>
                <p class="text-sm text-gray-400 mb-2">Current Plan</p>
                <h2 class="text-3xl font-bold text-white">
                  {{ subscriptionService.currentSubscriptionSignal()!.planName }}
                </h2>
              </div>
              <div
  class="w-20 h-20 bg-gradient-to-br rounded-full flex items-center justify-center"
  [ngClass]="{
    'from-orange-500 to-orange-600': subscriptionService.currentSubscriptionSignal()?.tier === 1,
    'from-gray-400 to-gray-500': subscriptionService.currentSubscriptionSignal()?.tier === 2,
    'from-yellow-500 to-yellow-600': subscriptionService.currentSubscriptionSignal()?.tier === 3
  }"
>
  <svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
    <path
      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
    />
  </svg>
</div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div class="bg-dark-700/50 rounded-lg p-4">
                <p class="text-sm text-gray-400 mb-1">Status</p>
                <p class="text-lg font-semibold text-green-400">
                  {{ subscriptionService.currentSubscriptionSignal()!.isActive ? 'Active' : 'Inactive' }}
                </p>
              </div>
              <div class="bg-dark-700/50 rounded-lg p-4">
                <p class="text-sm text-gray-400 mb-1">Started</p>
                <p class="text-lg font-semibold text-white">
                  {{ formatDate(subscriptionService.currentSubscriptionSignal()!.startDate) }}
                </p>
              </div>
              <div class="bg-dark-700/50 rounded-lg p-4">
                <p class="text-sm text-gray-400 mb-1">Renews</p>
                <p class="text-lg font-semibold text-white">
                  {{ subscriptionService.currentSubscriptionSignal()!.endDate ? formatDate(subscriptionService.currentSubscriptionSignal()!.endDate!) : 'Never' }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-4">
              <button 
                (click)="showUpgradeOptions()"
                class="px-6 py-3 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-700 transition-colors">
                Upgrade Plan
              </button>
              <button 
                (click)="confirmCancelSubscription()"
                class="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors">
                Cancel Subscription
              </button>
            </div>
          </div>
        } @else {
          <div class="bg-dark-800 rounded-xl p-8 border border-gray-700 mb-8 text-center animate-fade-in">
            <svg class="w-20 h-20 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"/>
            </svg>
            <h3 class="text-xl font-semibold text-white mb-2">No Active Subscription</h3>
            <p class="text-gray-400 mb-6">Choose a plan to start watching</p>
          </div>
        }

        <!-- Available Plans -->
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-white mb-6">Available Plans</h2>
          
          @if (loadingPlans()) {
            <app-loading-spinner text="Loading plans..." />
          } @else {
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    @for (plan of subscriptionService.plansSignal(); track plan.id) {
      <div 
        class="relative bg-dark-800 rounded-xl p-6 border transition-all hover:scale-105 hover:shadow-2xl"
        [class.border-gray-700]="plan.tier !== 2"
        [class.border-2]="plan.tier === 2"
        [class.border-gray-400]="plan.tier === 2"
        [class.transform]="plan.tier === 2"
        [class.scale-105]="plan.tier === 2">
        
        @if (plan.tier === 2) {
          <div class="absolute -top-3 left-1/2 -translate-x-1/2">
            <span class="px-4 py-1 bg-gradient-to-r from-gray-400 to-gray-500 text-white text-sm font-semibold rounded-full shadow-lg">
              POPULAR
            </span>
          </div>
        }

        <div class="text-center mb-6" [class.mt-2]="plan.tier === 2">
          <div 
            class="bg-gradient-to-br w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center shadow-lg"
            [ngClass]="{
              'from-orange-500 to-orange-600': plan.tier === 1,
              'from-gray-400 to-gray-500': plan.tier === 2,
              'from-yellow-500 to-yellow-600': plan.tier === 3
            }">
            <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-white mb-2">{{ plan.name }}</h3>
          <p class="text-4xl font-bold text-white mb-2">
            \${{ plan.pricePerMonth.toFixed(2) }}
            <span class="text-lg text-gray-400 font-normal">/mo</span>
          </p>
          <p class="text-sm text-gray-400 min-h-[40px]">{{ plan.description }}</p>
        </div>

        <!-- Features would go here -->
        <div class="mb-6 space-y-2 min-h-[120px]">
          <div class="flex items-center gap-2 text-sm text-gray-300">
            <svg class="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
            <span>{{ plan.tier === 1 ? 'Basic' : plan.tier === 2 ? 'Extended' : 'Full' }} catalog</span>
          </div>
          <div class="flex items-center gap-2 text-sm text-gray-300">
            <svg class="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
            <span>{{ plan.maxStreamQuality === 1 ? 'SD' : plan.maxStreamQuality === 2 ? 'HD' : '4K Ultra HD' }}</span>
          </div>
          <div class="flex items-center gap-2 text-sm text-gray-300">
            <svg class="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
            <span>{{ plan.tier }} {{ plan.tier === 1 ? 'device' : 'devices' }}</span>
          </div>
        </div>

        <button
          (click)="selectPlan(plan)"
          [disabled]="processingPayment() || isCurrentPlan(plan)"
          class="bg-gradient-to-r w-full py-3 font-semibold rounded-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
          [ngClass]="{
            'from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white': plan.tier === 1,
            'from-gray-400 to-gray-500 hover:from-gray-300 hover:to-gray-400 text-white': plan.tier === 2,
            'from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white': plan.tier === 3
          }">
          @if (processingPayment()) {
            <span class="flex items-center justify-center gap-2">
              <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Processing...
            </span>
          } @else if (isCurrentPlan(plan)) {
            <span>Current Plan</span>
          } @else {
            <span>Select Plan</span>
          }
        </button>
      </div>
    }
  </div>
          }
        </div>
      </div>
    </div>
        <app-confirmation-dialog
      [show]="showCancelDialog()"
      title="Cancel Subscription"
      message="Are you sure you want to cancel your subscription? You will lose access at the end of your billing period."
      type="danger"
      confirmText="Yes, Cancel"
      cancelText="Keep Subscription"
      [showInput]="true"
      inputLabel="Tell us why you're cancelling (optional)"
      inputPlaceholder="Your feedback helps us improve..."
      (confirm)="onConfirmCancel($event)"
      (cancel)="showCancelDialog.set(false)">
    </app-confirmation-dialog>
  `
})
export class SubscriptionComponent implements OnInit {
  authService = inject(AuthService);
  subscriptionService = inject(SubscriptionService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  showCancelDialog = signal(false);
isCurrentPlan(plan: SubscriptionPlan): boolean {
  const currentSub = this.subscriptionService.currentSubscriptionSignal();
  return currentSub?.tier === plan.tier;
}
  onConfirmCancel(reason: string): void {
    this.showCancelDialog.set(false);

    this.subscriptionService.cancelSubscription(reason || undefined).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastService.success('Subscription cancelled successfully');
          this.loadCurrentSubscription();
          
          setTimeout(() => {
            // window.location.reload();
          }, 1500);
        }
      },
      error: (error) => {
        this.toastService.error(error.error?.message || 'Failed to cancel subscription');
      }
    });
  }

  loadingPlans = signal(false);
  processingPayment = signal(false);

  ngOnInit(): void {
    this.loadPlans();
    this.loadCurrentSubscription();
  }

  loadPlans(): void {
    this.loadingPlans.set(true);
    this.subscriptionService.getPlans().subscribe({
      next: () => this.loadingPlans.set(false),
      error: () => {
        this.loadingPlans.set(false);
        this.toastService.error('Failed to load subscription plans');
      }
    });
  }

  loadCurrentSubscription(): void {
    this.subscriptionService.getMySubscription().subscribe({
      error: (error) => {
        console.error('Error loading subscription:', error);
      }
    });
  }

  selectPlan(plan: SubscriptionPlan): void {
    if (this.processingPayment()) return;

    // Check if user already has this plan
    const currentSub = this.subscriptionService.currentSubscriptionSignal();
    if (currentSub && currentSub.tier === plan.tier) {
      this.toastService.info('You already have this plan');
      return;
    }

    // Check if upgrade or new subscription
    if (currentSub) {
      if (plan.tier > currentSub.tier) {
        this.upgradePlan(plan);
      } else {
        this.toastService.warning('Please cancel your current plan first to downgrade');
      }
    } else {
      this.subscribeToPlan(plan);
    }
  }

  subscribeToPlan(plan: SubscriptionPlan): void {
    this.processingPayment.set(true);

    // Simulate payment (in production, show payment modal/form)
    const request = {
      planId: plan.id,
      paymentMethod: 1, // CreditCard
    };

    this.subscriptionService.subscribeToPlan(request).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastService.success(`Successfully subscribed to ${plan.name}!`);
          this.loadCurrentSubscription();
          
          // Reload user data to update subscription in auth
          setTimeout(() => {
            // window.location.reload();
          }, 1500);
        }
        this.processingPayment.set(false);
      },
      error: (error) => {
        this.processingPayment.set(false);
        this.toastService.error(error.error?.message || 'Failed to process subscription');
      }
    });
  }

upgradePlan(plan: SubscriptionPlan): void {
  this.processingPayment.set(true);

  this.subscriptionService.upgradeSubscription(plan.id).subscribe({
    next: (response) => {
      if (response.success) {
        this.toastService.success(`Successfully upgraded to ${plan.name}!`);
        
        // Update auth service user data
        this.authService.user.set({
          ...this.authService.user()!,
          currentSubscription: response.data
        });
        
        this.loadCurrentSubscription();
        this.processingPayment.set(false);
      }
    },
    error: (error) => {
      this.processingPayment.set(false);
      this.toastService.error(error.error?.message || 'Failed to upgrade subscription');
    }
  });
}

  showUpgradeOptions(): void {
    this.toastService.info('Choose a higher tier plan below to upgrade');
  }

  confirmCancelSubscription(): void {
    this.showCancelDialog.set(true);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}