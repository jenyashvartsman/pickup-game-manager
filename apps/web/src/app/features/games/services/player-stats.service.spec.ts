import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { PlayerStatsService } from './player-stats.service';
import { PlayerStat } from '../models/game.model';

const mockStats: PlayerStat[] = [
  {
    id: 's1',
    gameId: 'g1',
    playerId: 'p1',
    goals: 2,
    assists: 1,
    yellowCards: 0,
    redCards: 0,
    minutesPlayed: 90,
    createdAt: '2026-11-05T00:00:00.000Z',
    updatedAt: '2026-11-05T00:00:00.000Z',
  },
  {
    id: 's2',
    gameId: 'g1',
    playerId: 'p2',
    goals: 0,
    assists: 2,
    yellowCards: 1,
    redCards: 0,
    minutesPlayed: 75,
    createdAt: '2026-11-05T00:00:00.000Z',
    updatedAt: '2026-11-05T00:00:00.000Z',
  },
];

describe('PlayerStatsService', () => {
  let service: PlayerStatsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(PlayerStatsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('stats signal starts empty', () => {
    expect(service.stats()).toEqual([]);
  });

  it('isLoading signal starts false', () => {
    expect(service.isLoading()).toBe(false);
  });

  describe('loadStats()', () => {
    it('sets isLoading to true while request is in-flight', () => {
      service.loadStats('g1');
      expect(service.isLoading()).toBe(true);
      httpMock
        .expectOne('http://localhost:3000/api/games/g1/stats')
        .flush(mockStats);
    });

    it('populates stats signal on success', () => {
      service.loadStats('g1');
      httpMock
        .expectOne('http://localhost:3000/api/games/g1/stats')
        .flush(mockStats);
      expect(service.stats()).toEqual(mockStats);
    });

    it('sets isLoading to false on success', () => {
      service.loadStats('g1');
      httpMock
        .expectOne('http://localhost:3000/api/games/g1/stats')
        .flush(mockStats);
      expect(service.isLoading()).toBe(false);
    });

    it('sets isLoading to false on error', () => {
      service.loadStats('g1');
      httpMock
        .expectOne('http://localhost:3000/api/games/g1/stats')
        .flush('Server Error', { status: 500, statusText: 'Server Error' });
      expect(service.isLoading()).toBe(false);
    });
  });

  describe('upsertStats()', () => {
    it('sends PUT to /games/:id/stats', () => {
      service
        .upsertStats('g1', [{ playerId: 'p1', goals: 2, assists: 1 }])
        .subscribe();
      const req = httpMock.expectOne('http://localhost:3000/api/games/g1/stats');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual([
        { playerId: 'p1', goals: 2, assists: 1 },
      ]);
      req.flush(mockStats);
    });

    it('updates stats signal on success', () => {
      service
        .upsertStats('g1', [{ playerId: 'p1', goals: 2 }])
        .subscribe();
      httpMock
        .expectOne('http://localhost:3000/api/games/g1/stats')
        .flush(mockStats);
      expect(service.stats()).toEqual(mockStats);
    });
  });
});
