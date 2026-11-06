import { Component, inject } from '@angular/core';
import { ErrorNotificationService } from '../../../core/services/error-notification.service';

@Component({
  selector: 'app-error-toast',
  templateUrl: './error-toast.component.html',
  styleUrl: './error-toast.component.scss',
})
export class ErrorToastComponent {
  protected readonly errorNotification = inject(ErrorNotificationService);
}
