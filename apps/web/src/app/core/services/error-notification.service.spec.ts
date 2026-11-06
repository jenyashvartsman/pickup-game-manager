import { TestBed } from '@angular/core/testing';
import { ErrorNotificationService } from './error-notification.service';

describe('ErrorNotificationService', () => {
  let service: ErrorNotificationService;

  beforeEach(() => {
    jest.useFakeTimers();
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorNotificationService);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('starts with null errorMessage', () => {
    expect(service.errorMessage()).toBeNull();
  });

  it('sets errorMessage on show()', () => {
    service.show('Something went wrong');
    expect(service.errorMessage()).toBe('Something went wrong');
  });

  it('clears errorMessage on dismiss()', () => {
    service.show('Error');
    service.dismiss();
    expect(service.errorMessage()).toBeNull();
  });

  it('auto-dismisses after 5 seconds', () => {
    service.show('Error');
    expect(service.errorMessage()).toBe('Error');
    jest.advanceTimersByTime(5000);
    expect(service.errorMessage()).toBeNull();
  });

  it('resets the timer when show() is called again', () => {
    service.show('First error');
    jest.advanceTimersByTime(3000);
    service.show('Second error');
    jest.advanceTimersByTime(3000);
    // 3s since last show() — still visible
    expect(service.errorMessage()).toBe('Second error');
    jest.advanceTimersByTime(2000);
    // 5s since last show() — dismissed
    expect(service.errorMessage()).toBeNull();
  });
});
