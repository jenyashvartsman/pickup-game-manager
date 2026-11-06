import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { ErrorNotificationService } from '../services/error-notification.service';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorNotification = inject(ErrorNotificationService);
  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        errorNotification.show(toUserMessage(error));
      }
      return throwError(() => error);
    })
  );
};

function toUserMessage(error: HttpErrorResponse): string {
  if (error.status === 0) return 'Unable to reach the server. Check your connection.';
  if (error.status === 401) return 'Unauthorised (401).';
  if (error.status === 403) return 'Permission denied (403).';
  if (error.status === 404) return 'Resource not found (404).';
  if (error.status >= 500) return 'A server error occurred. Please try again.';
  return `Request failed (${error.status}).`;
}
