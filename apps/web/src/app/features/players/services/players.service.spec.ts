import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { PlayersService } from './players.service';
import { Player } from '../models/player.model';

const mockPlayers: Player[] = [
  {
    id: '1',
    name: 'Alice Smith',
    position: 'Forward',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '2',
    name: 'Bob Jones',
    position: 'Defender',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
];

describe('PlayersService', () => {
  let service: PlayersService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(PlayersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('players signal starts empty', () => {
    expect(service.players()).toEqual([]);
  });

  it('isLoading signal starts false', () => {
    expect(service.isLoading()).toBe(false);
  });

  describe('loadPlayers()', () => {
    it('sets isLoading to true while request is in-flight', () => {
      service.loadPlayers();
      expect(service.isLoading()).toBe(true);
      httpMock.expectOne('http://localhost:3000/api/players').flush([]);
    });

    it('populates players signal on success', () => {
      service.loadPlayers();
      httpMock
        .expectOne('http://localhost:3000/api/players')
        .flush(mockPlayers);
      expect(service.players()).toEqual(mockPlayers);
    });

    it('sets isLoading to false on success', () => {
      service.loadPlayers();
      httpMock.expectOne('http://localhost:3000/api/players').flush([]);
      expect(service.isLoading()).toBe(false);
    });

    it('sets isLoading to false on error', () => {
      service.loadPlayers();
      httpMock
        .expectOne('http://localhost:3000/api/players')
        .flush('Server error', { status: 500, statusText: 'Internal Server Error' });
      expect(service.isLoading()).toBe(false);
    });
  });

  describe('getPlayer()', () => {
    it('requests GET /players/:id', () => {
      let result: Player | undefined;
      service.getPlayer('1').subscribe((p) => (result = p));
      const req = httpMock.expectOne('http://localhost:3000/api/players/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockPlayers[0]);
      expect(result).toEqual(mockPlayers[0]);
    });
  });

  describe('createPlayer()', () => {
    it('sends POST to /players', () => {
      service.createPlayer({ name: 'Carol', position: 'Goalkeeper' }).subscribe();
      const req = httpMock.expectOne('http://localhost:3000/api/players');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ name: 'Carol', position: 'Goalkeeper' });
      req.flush({ id: '3', name: 'Carol', position: 'Goalkeeper', createdAt: '2024-01-01', updatedAt: '2024-01-01' });
    });

    it('appends new player to the signal', () => {
      service.players.set([...mockPlayers]);
      const newPlayer: Player = {
        id: '3',
        name: 'Carol',
        position: 'Goalkeeper',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      };
      service.createPlayer({ name: 'Carol', position: 'Goalkeeper' }).subscribe();
      httpMock.expectOne('http://localhost:3000/api/players').flush(newPlayer);
      expect(service.players()).toHaveLength(3);
      expect(service.players()[2]).toEqual(newPlayer);
    });
  });

  describe('updatePlayer()', () => {
    it('sends PATCH to /players/:id', () => {
      service.updatePlayer('1', { name: 'Alice Updated' }).subscribe();
      const req = httpMock.expectOne('http://localhost:3000/api/players/1');
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({ name: 'Alice Updated' });
      req.flush({ ...mockPlayers[0], name: 'Alice Updated' });
    });

    it('replaces the updated player in the signal', () => {
      service.players.set([...mockPlayers]);
      const updated: Player = { ...mockPlayers[0], name: 'Alice Updated' };
      service.updatePlayer('1', { name: 'Alice Updated' }).subscribe();
      httpMock.expectOne('http://localhost:3000/api/players/1').flush(updated);
      expect(service.players()[0].name).toBe('Alice Updated');
      expect(service.players()).toHaveLength(2);
    });
  });

  describe('deletePlayer()', () => {
    it('sends DELETE to /players/:id', () => {
      service.deletePlayer('1').subscribe();
      const req = httpMock.expectOne('http://localhost:3000/api/players/1');
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('removes the deleted player from the signal', () => {
      service.players.set([...mockPlayers]);
      service.deletePlayer('1').subscribe();
      httpMock.expectOne('http://localhost:3000/api/players/1').flush(null);
      expect(service.players()).toHaveLength(1);
      expect(service.players()[0].id).toBe('2');
    });
  });
});
