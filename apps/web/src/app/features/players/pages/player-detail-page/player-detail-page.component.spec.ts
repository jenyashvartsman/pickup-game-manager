import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { PlayerDetailPageComponent } from './player-detail-page.component';
import { PlayersService } from '../../services/players.service';
import { Player, PlayerStat, computeCareerTotals } from '../../models/player.model';

const mockPlayer: Player = {
  id: 'player-1',
  name: 'Alice',
  position: 'forward',
  createdAt: '2026-11-01T00:00:00Z',
  updatedAt: '2026-11-01T00:00:00Z',
};

const makeStat = (overrides: Partial<PlayerStat> = {}): PlayerStat => ({
  id: 'stat-1',
  gameId: 'game-1',
  playerId: 'player-1',
  gameScheduledAt: '2026-11-08T18:00:00Z',
  goals: 1,
  assists: 1,
  yellowCards: 0,
  redCards: 0,
  minutesPlayed: 90,
  createdAt: '2026-11-08T20:00:00Z',
  updatedAt: '2026-11-08T20:00:00Z',
  ...overrides,
});

describe('computeCareerTotals', () => {
  it('returns zeros for empty stats', () => {
    const totals = computeCareerTotals([]);
    expect(totals).toEqual({
      gamesPlayed: 0,
      goals: 0,
      assists: 0,
      yellowCards: 0,
      redCards: 0,
      minutesPlayed: 0,
    });
  });

  it('sums all stat fields across multiple games', () => {
    const stats = [
      makeStat({ goals: 2, assists: 1, yellowCards: 1, redCards: 0, minutesPlayed: 90 }),
      makeStat({ id: 'stat-2', gameId: 'game-2', goals: 0, assists: 2, yellowCards: 0, redCards: 1, minutesPlayed: 60 }),
    ];
    const totals = computeCareerTotals(stats);
    expect(totals.gamesPlayed).toBe(2);
    expect(totals.goals).toBe(2);
    expect(totals.assists).toBe(3);
    expect(totals.yellowCards).toBe(1);
    expect(totals.redCards).toBe(1);
    expect(totals.minutesPlayed).toBe(150);
  });

  it('counts each stat row as one game played', () => {
    const stats = [makeStat(), makeStat({ id: 's2' }), makeStat({ id: 's3' })];
    expect(computeCareerTotals(stats).gamesPlayed).toBe(3);
  });
});

describe('PlayerDetailPageComponent', () => {
  let fixture: ComponentFixture<PlayerDetailPageComponent>;
  let playersServiceMock: jest.Mocked<Partial<PlayersService>>;

  beforeEach(async () => {
    playersServiceMock = {
      getPlayer: jest.fn().mockReturnValue(of(mockPlayer)),
      getPlayerStats: jest.fn().mockReturnValue(of([])),
    };

    await TestBed.configureTestingModule({
      imports: [PlayerDetailPageComponent],
      providers: [
        { provide: PlayersService, useValue: playersServiceMock },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => 'player-1' } } },
        },
        { provide: Router, useValue: { navigate: jest.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PlayerDetailPageComponent);
  });

  it('loads the player on init', () => {
    fixture.detectChanges();
    expect(playersServiceMock.getPlayer).toHaveBeenCalledWith('player-1');
  });

  it('loads player stats after loading the player', () => {
    fixture.detectChanges();
    expect(playersServiceMock.getPlayerStats).toHaveBeenCalledWith('player-1');
  });

  it('renders the player name', () => {
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.player-detail-page__name')?.textContent).toContain('Alice');
  });

  it('shows all six career total stat cards', () => {
    fixture.detectChanges();
    const cards = fixture.nativeElement.querySelectorAll('.player-detail-page__stat-card');
    expect(cards.length).toBe(6);
  });

  it('shows computed career totals in stat cards', () => {
    (playersServiceMock.getPlayerStats as jest.Mock).mockReturnValue(
      of([makeStat({ goals: 3, assists: 2, minutesPlayed: 85 })])
    );
    fixture.detectChanges();

    const values = Array.from(
      fixture.nativeElement.querySelectorAll('.player-detail-page__stat-value')
    ).map((el) => (el as HTMLElement).textContent?.trim());

    // order: gamesPlayed, goals, assists, yellowCards, redCards, minutesPlayed
    expect(values[0]).toBe('1');
    expect(values[1]).toBe('3');
    expect(values[2]).toBe('2');
    expect(values[5]).toBe('85');
  });

  it('handles player load error without crashing', () => {
    (playersServiceMock.getPlayer as jest.Mock).mockReturnValue(throwError(() => new Error('not found')));
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
