import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ErrorNotificationService {
  readonly errorMessage = signal<string | null>(null);
  private dismissTimer: ReturnType<typeof setTimeout> | null = null;

  show(message: string): void {
    if (this.dismissTimer) {
      clearTimeout(this.dismissTimer);
    }
    this.errorMessage.set(message);
    this.dismissTimer = setTimeout(() => this.dismiss(), 5000);
  }

  dismiss(): void {
    if (this.dismissTimer) {
      clearTimeout(this.dismissTimer);
      this.dismissTimer = null;
    }
    this.errorMessage.set(null);
  }
}
