import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { GamesService } from './games.service';
import { Game } from '../models/game.model';

const mockGames: Game[] = [
  {
    id: 'g1',
    scheduledAt: '2026-11-03T10:00:00.000Z',
    location: 'Central Park',
    status: 'scheduled',
    createdAt: '2026-11-01T00:00:00.000Z',
    updatedAt: '2026-11-01T00:00:00.000Z',
  },
  {
    id: 'g2',
    scheduledAt: '2026-11-05T14:00:00.000Z',
    location: null,
    status: 'completed',
    createdAt: '2026-11-01T00:00:00.000Z',
    updatedAt: '2026-11-05T00:00:00.000Z',
  },
];

describe('GamesService', () => {
  let service: GamesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(GamesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('games signal starts empty', () => {
    expect(service.games()).toEqual([]);
  });

  it('isLoading signal starts false', () => {
    expect(service.isLoading()).toBe(false);
  });

  it('selectedWeek signal starts on Monday', () => {
    const day = service.selectedWeek().getDay();
    expect(day).toBe(1); // Monday
  });

  describe('weekRange computed', () => {
    it('from is the selectedWeek (Monday)', () => {
      const { from } = service.weekRange();
      expect(from.getDay()).toBe(1);
    });

    it('to falls on a Sunday', () => {
      const { to } = service.weekRange();
      expect(to.getDay()).toBe(0); // Sunday
    });
  });

  describe('loadGamesForWeek()', () => {
    it('sets isLoading to true while request is in-flight', () => {
      service.loadGamesForWeek();
      expect(service.isLoading()).toBe(true);
      const req = httpMock.expectOne((r) =>
        r.url === 'http://localhost:3000/api/games'
      );
      req.flush([]);
    });

    it('populates games signal on success', () => {
      service.loadGamesForWeek();
      const req = httpMock.expectOne((r) =>
        r.url === 'http://localhost:3000/api/games'
      );
      req.flush(mockGames);
      expect(service.games()).toEqual(mockGames);
    });

    it('sets isLoading to false on success', () => {
      service.loadGamesForWeek();
      const req = httpMock.expectOne((r) =>
        r.url === 'http://localhost:3000/api/games'
      );
      req.flush([]);
      expect(service.isLoading()).toBe(false);
    });

    it('sets isLoading to false on error', () => {
      service.loadGamesForWeek();
      const req = httpMock.expectOne((r) =>
        r.url === 'http://localhost:3000/api/games'
      );
      req.flush('Server error', { status: 500, statusText: 'Server Error' });
      expect(service.isLoading()).toBe(false);
    });
  });

  describe('goToPreviousWeek()', () => {
    it('moves selectedWeek back 7 calendar days', () => {
      const before = service.selectedWeek();
      const expected = new Date(before);
      expected.setDate(expected.getDate() - 7);
      service.goToPreviousWeek();
      const after = service.selectedWeek();
      expect(after.getFullYear()).toBe(expected.getFullYear());
      expect(after.getMonth()).toBe(expected.getMonth());
      expect(after.getDate()).toBe(expected.getDate());
    });
  });

  describe('goToNextWeek()', () => {
    it('moves selectedWeek forward 7 calendar days', () => {
      const before = service.selectedWeek();
      const expected = new Date(before);
      expected.setDate(expected.getDate() + 7);
      service.goToNextWeek();
      const after = service.selectedWeek();
      expect(after.getFullYear()).toBe(expected.getFullYear());
      expect(after.getMonth()).toBe(expected.getMonth());
      expect(after.getDate()).toBe(expected.getDate());
    });
  });

  describe('goToCurrentWeek()', () => {
    it('resets selectedWeek to the current Monday', () => {
      service.goToNextWeek();
      service.goToCurrentWeek();
      const day = service.selectedWeek().getDay();
      expect(day).toBe(1);
    });
  });

  describe('createGame()', () => {
    it('sends POST to /games', () => {
      service
        .createGame({ scheduledAt: '2026-11-10T10:00:00.000Z', location: 'Park' })
        .subscribe();
      const req = httpMock.expectOne('http://localhost:3000/api/games');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        scheduledAt: '2026-11-10T10:00:00.000Z',
        location: 'Park',
      });
      req.flush(mockGames[0]);
    });

    it('appends new game to the signal', () => {
      service.games.set([...mockGames]);
      const newGame: Game = {
        id: 'g3',
        scheduledAt: '2026-11-10T10:00:00.000Z',
        location: 'Park',
        status: 'scheduled',
        createdAt: '2026-11-05T00:00:00.000Z',
        updatedAt: '2026-11-05T00:00:00.000Z',
      };
      service
        .createGame({ scheduledAt: '2026-11-10T10:00:00.000Z', location: 'Park' })
        .subscribe();
      httpMock.expectOne('http://localhost:3000/api/games').flush(newGame);
      expect(service.games()).toHaveLength(3);
      expect(service.games()[2]).toEqual(newGame);
    });
  });

  describe('updateGame()', () => {
    it('sends PATCH to /games/:id', () => {
      service.updateGame('g1', { location: 'Stadium' }).subscribe();
      const req = httpMock.expectOne('http://localhost:3000/api/games/g1');
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({ location: 'Stadium' });
      req.flush({ ...mockGames[0], location: 'Stadium' });
    });

    it('replaces the updated game in the signal', () => {
      service.games.set([...mockGames]);
      const updated: Game = { ...mockGames[0], location: 'Stadium' };
      service.updateGame('g1', { location: 'Stadium' }).subscribe();
      httpMock.expectOne('http://localhost:3000/api/games/g1').flush(updated);
      expect(service.games()[0].location).toBe('Stadium');
    });
  });

  describe('deleteGame()', () => {
    it('sends DELETE to /games/:id', () => {
      service.deleteGame('g1').subscribe();
      const req = httpMock.expectOne('http://localhost:3000/api/games/g1');
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('removes the deleted game from the signal', () => {
      service.games.set([...mockGames]);
      service.deleteGame('g1').subscribe();
      httpMock.expectOne('http://localhost:3000/api/games/g1').flush(null);
      expect(service.games()).toHaveLength(1);
      expect(service.games()[0].id).toBe('g2');
    });
  });
});
