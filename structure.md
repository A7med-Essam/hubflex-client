<!-- ## Phase 2: Project Structure
```
src/
├── app/
│   ├── core/                      # Singleton services, guards, interceptors
│   │   ├── guards/
│   │   │   ├── auth.guard.ts
│   │   │   └── subscription.guard.ts
│   │   ├── interceptors/
│   │   │   ├── auth.interceptor.ts
│   │   │   └── error.interceptor.ts
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── movie.service.ts
│   │   │   ├── review.service.ts
│   │   │   ├── support-chat.service.ts
│   │   │   └── toast.service.ts
│   │   └── models/
│   │       ├── user.model.ts
│   │       ├── movie.model.ts
│   │       └── api-response.model.ts
│   ├── features/                  # Feature modules (standalone)
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── auth.routes.ts
│   │   ├── home/
│   │   │   ├── home.component.ts
│   │   │   └── home.routes.ts
│   │   ├── movies/
│   │   │   ├── movie-list/
│   │   │   ├── movie-detail/
│   │   │   ├── movie-player/
│   │   │   └── movies.routes.ts
│   │   ├── profile/
│   │   │   ├── watch-later/
│   │   │   ├── my-reviews/
│   │   │   └── profile.routes.ts
│   │   ├── support/
│   │   │   ├── support-chat/
│   │   │   └── support.routes.ts
│   │   └── admin/
│   │       ├── dashboard/
│   │       ├── movies-management/
│   │       └── admin.routes.ts
│   ├── shared/                    # Shared components, directives, pipes
│   │   ├── components/
│   │   │   ├── navbar/
│   │   │   ├── footer/
│   │   │   ├── movie-card/
│   │   │   ├── rating-stars/
│   │   │   ├── loading-spinner/
│   │   │   └── toast/
│   │   ├── directives/
│   │   │   └── lazy-load-image.directive.ts
│   │   └── pipes/
│   │       ├── duration.pipe.ts
│   │       └── date-ago.pipe.ts
│   ├── app.component.ts
│   ├── app.config.ts
│   └── app.routes.ts
├── assets/
│   ├── images/
│   └── icons/
├── environments/
│   ├── environment.ts
│   └── environment.development.ts
└── styles.scss -->