import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError(error => {
      if (error.status === 401) {
        router.navigate(['/auth/login']);
        toastService.error('Session expired. Please login again.');
      } else if (error.status === 403) {
        toastService.error('You do not have permission to access this resource.');
      } else if (error.status === 429) {
        toastService.error('Too many requests. Please try again later.');
      } else if (error.status >= 500) {
        toastService.error('Server error. Please try again later.');
      }

      return throwError(() => error);
    })
  );
};