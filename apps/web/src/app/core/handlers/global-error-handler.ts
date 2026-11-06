import { ErrorHandler, Injectable, inject } from '@angular/core';
import { ErrorNotificationService } from '../services/error-notification.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private readonly errorNotification = inject(ErrorNotificationService);

  handleError(error: unknown): void {
    const message =
      error instanceof Error ? error.message : 'An unexpected error occurred.';
    console.error('[GlobalErrorHandler]', error);
    this.errorNotification.show(message);
  }
}
