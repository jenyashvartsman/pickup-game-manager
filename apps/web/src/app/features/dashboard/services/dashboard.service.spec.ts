import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { DashboardService } from './dashboard.service';
import { DashboardSummary } from '../models/dashboard.model';

const mockSummary: DashboardSummary = {
  upcomingGames: [
    {
      id: 'g1',
      scheduledAt: '2026-11-10T10:00:00.000Z',
      location: 'Central Park',
      playerCount: 10,
    },
  ],
  recentResults: [
    {
      id: 'g2',
      scheduledAt: '2026-11-03T10:00:00.000Z',
      location: 'Stadium',
      scoreTeamA: 3,
      scoreTeamB: 2,
    },
  ],
  topPlayers: [
    {
      id: 'p1',
      name: 'Alice',
      position: 'Forward',
      totalGoals: 7,
      totalAssists: 3,
    },
  ],
};

describe('DashboardService', () => {
  let service: DashboardService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(DashboardService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('summary signal starts with empty arrays', () => {
    const s = service.summary();
    expect(s.upcomingGames).toEqual([]);
    expect(s.recentResults).toEqual([]);
    expect(s.topPlayers).toEqual([]);
  });

  it('isLoading signal starts false', () => {
    expect(service.isLoading()).toBe(false);
  });

  describe('loadSummary()', () => {
    it('sets isLoading to true while request is in-flight', () => {
      service.loadSummary();
      expect(service.isLoading()).toBe(true);
      httpMock.expectOne('http://localhost:3000/api/dashboard').flush(mockSummary);
    });

    it('populates summary signal on success', () => {
      service.loadSummary();
      httpMock
        .expectOne('http://localhost:3000/api/dashboard')
        .flush(mockSummary);
      expect(service.summary()).toEqual(mockSummary);
    });

    it('sets isLoading to false on success', () => {
      service.loadSummary();
      httpMock
        .expectOne('http://localhost:3000/api/dashboard')
        .flush(mockSummary);
      expect(service.isLoading()).toBe(false);
    });

    it('sets isLoading to false on error', () => {
      service.loadSummary();
      httpMock
        .expectOne('http://localhost:3000/api/dashboard')
        .flush('Server error', { status: 500, statusText: 'Server Error' });
      expect(service.isLoading()).toBe(false);
    });

    it('keeps previous summary on error', () => {
      service.loadSummary();
      httpMock
        .expectOne('http://localhost:3000/api/dashboard')
        .flush(mockSummary);

      service.loadSummary();
      httpMock
        .expectOne('http://localhost:3000/api/dashboard')
        .flush('err', { status: 500, statusText: 'Server Error' });

      expect(service.summary()).toEqual(mockSummary);
    });
  });
});
