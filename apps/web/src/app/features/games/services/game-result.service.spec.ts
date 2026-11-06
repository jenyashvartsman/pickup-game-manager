import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { GameResultService } from './game-result.service';
import { GameResult } from '../models/game.model';

const mockResult: GameResult = {
  id: 'r1',
  gameId: 'g1',
  scoreTeamA: 3,
  scoreTeamB: 1,
  createdAt: '2026-11-05T00:00:00.000Z',
  updatedAt: '2026-11-05T00:00:00.000Z',
};

describe('GameResultService', () => {
  let service: GameResultService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(GameResultService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('result signal starts null', () => {
    expect(service.result()).toBeNull();
  });

  it('isLoading signal starts false', () => {
    expect(service.isLoading()).toBe(false);
  });

  describe('loadResult()', () => {
    it('sets isLoading to true while request is in-flight', () => {
      service.loadResult('g1');
      expect(service.isLoading()).toBe(true);
      httpMock
        .expectOne('http://localhost:3000/api/games/g1/result')
        .flush(mockResult);
    });

    it('populates result signal on success', () => {
      service.loadResult('g1');
      httpMock
        .expectOne('http://localhost:3000/api/games/g1/result')
        .flush(mockResult);
      expect(service.result()).toEqual(mockResult);
    });

    it('sets isLoading to false on success', () => {
      service.loadResult('g1');
      httpMock
        .expectOne('http://localhost:3000/api/games/g1/result')
        .flush(mockResult);
      expect(service.isLoading()).toBe(false);
    });

    it('sets result to null and isLoading to false on error', () => {
      service.loadResult('g1');
      httpMock
        .expectOne('http://localhost:3000/api/games/g1/result')
        .flush('Not Found', { status: 404, statusText: 'Not Found' });
      expect(service.result()).toBeNull();
      expect(service.isLoading()).toBe(false);
    });
  });

  describe('createResult()', () => {
    it('sends POST to /games/:id/result', () => {
      service
        .createResult('g1', { scoreTeamA: 2, scoreTeamB: 0 })
        .subscribe();
      const req = httpMock.expectOne(
        'http://localhost:3000/api/games/g1/result'
      );
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ scoreTeamA: 2, scoreTeamB: 0 });
      req.flush(mockResult);
    });

    it('updates result signal on success', () => {
      service
        .createResult('g1', { scoreTeamA: 3, scoreTeamB: 1 })
        .subscribe();
      httpMock
        .expectOne('http://localhost:3000/api/games/g1/result')
        .flush(mockResult);
      expect(service.result()).toEqual(mockResult);
    });
  });

  describe('updateResult()', () => {
    it('sends PATCH to /games/:id/result', () => {
      service.updateResult('g1', { scoreTeamA: 4 }).subscribe();
      const req = httpMock.expectOne(
        'http://localhost:3000/api/games/g1/result'
      );
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({ scoreTeamA: 4 });
      req.flush({ ...mockResult, scoreTeamA: 4 });
    });

    it('updates result signal on success', () => {
      const updated: GameResult = { ...mockResult, scoreTeamA: 4 };
      service.updateResult('g1', { scoreTeamA: 4 }).subscribe();
      httpMock
        .expectOne('http://localhost:3000/api/games/g1/result')
        .flush(updated);
      expect(service.result()?.scoreTeamA).toBe(4);
    });
  });
});
