import { TestBed } from '@angular/core/testing';
import { ErrorToastComponent } from './error-toast.component';
import { ErrorNotificationService } from '../../../core/services/error-notification.service';

describe('ErrorToastComponent', () => {
  let errorService: ErrorNotificationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorToastComponent],
    }).compileComponents();
    errorService = TestBed.inject(ErrorNotificationService);
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ErrorToastComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('is not rendered when errorMessage is null', () => {
    const fixture = TestBed.createComponent(ErrorToastComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.error-toast')).toBeNull();
  });

  it('renders the toast when errorMessage is set', () => {
    errorService.show('Something went wrong');
    const fixture = TestBed.createComponent(ErrorToastComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.error-toast')).toBeTruthy();
  });

  it('displays the error message text', () => {
    errorService.show('Database connection failed');
    const fixture = TestBed.createComponent(ErrorToastComponent);
    fixture.detectChanges();
    const msg = fixture.nativeElement.querySelector('.error-toast__message');
    expect(msg?.textContent?.trim()).toBe('Database connection failed');
  });

  it('dismisses the toast on clicking the dismiss button', () => {
    errorService.show('Error');
    const fixture = TestBed.createComponent(ErrorToastComponent);
    fixture.detectChanges();

    const btn = fixture.nativeElement.querySelector('.error-toast__dismiss');
    btn.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.error-toast')).toBeNull();
  });
});
