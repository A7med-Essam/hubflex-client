import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'auth/login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'auth/register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
    canActivate: [authGuard]
  },
  {
    path: 'movies',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/movies/movie-list/movie-list.component').then(m => m.MovieListComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./features/movies/movie-detail/movie-detail.component').then(m => m.MovieDetailComponent)
      },
      {
        path: ':id/play',
        loadComponent: () => import('./features/movies/movie-player/movie-player.component').then(m => m.MoviePlayerComponent)
      }
    ]
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    children: [
      {
        path: 'watch-later',
        loadComponent: () => import('./features/profile/watch-later/watch-later.component').then(m => m.WatchLaterComponent)
      },
      {
        path: 'reviews',
        loadComponent: () => import('./features/profile/my-reviews/my-reviews.component').then(m => m.MyReviewsComponent)
      },
      {
        path: 'subscription',
        loadComponent: () => import('./features/profile/subscription/subscription.component').then(m => m.SubscriptionComponent)
      }
    ]
  },
  {
    path: 'support',
    loadComponent: () => import('./features/support/support-chat/support-chat.component').then(m => m.SupportChatComponent),
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/admin/dashboard/dashboard.component').then(m => m.AdminDashboardComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/home'
  }
];