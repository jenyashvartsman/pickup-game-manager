import { TestBed } from '@angular/core/testing';
import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { httpErrorInterceptor } from './http-error.interceptor';
import { ErrorNotificationService } from '../services/error-notification.service';

describe('httpErrorInterceptor', () => {
  let httpMock: HttpTestingController;
  let errorService: ErrorNotificationService;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([httpErrorInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    httpMock = TestBed.inject(HttpTestingController);
    errorService = TestBed.inject(ErrorNotificationService);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => httpMock.verify());

  it('shows error message on 500 response', () => {
    httpClient.get('/api/test').subscribe({ error: jest.fn() });
    httpMock
      .expectOne('/api/test')
      .flush('error', { status: 500, statusText: 'Server Error' });
    expect(errorService.errorMessage()).toContain('server error');
  });

  it('shows error message on 404 response', () => {
    httpClient.get('/api/test').subscribe({ error: jest.fn() });
    httpMock
      .expectOne('/api/test')
      .flush('not found', { status: 404, statusText: 'Not Found' });
    expect(errorService.errorMessage()).toContain('404');
  });

  it('shows error message on 403 response', () => {
    httpClient.get('/api/test').subscribe({ error: jest.fn() });
    httpMock
      .expectOne('/api/test')
      .flush('forbidden', { status: 403, statusText: 'Forbidden' });
    expect(errorService.errorMessage()).toContain('403');
  });

  it('shows connection error on status 0', () => {
    httpClient.get('/api/test').subscribe({ error: jest.fn() });
    httpMock
      .expectOne('/api/test')
      .flush('error', { status: 0, statusText: 'Unknown Error' });
    expect(errorService.errorMessage()).toContain('server');
  });

  it('does not show error on successful response', () => {
    httpClient.get('/api/test').subscribe();
    httpMock.expectOne('/api/test').flush({ ok: true });
    expect(errorService.errorMessage()).toBeNull();
  });
});
